/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
// import { useEffect, useRef, useState } from 'react';
// import { ControlPosition, MapControl } from '@vis.gl/react-google-maps';
// import ControlPanel from './control-panel';
// import { MovingMarker } from './moving-marker';
// import { MarkerWithInfowindow } from './marker-with-infowindow';
import { PlaceAutocompleteClassic } from '../../LifeMap/autocomplete-classic';
import { Form, Card, InputGroup, Button } from 'react-bootstrap';
import { IDBBlockstore } from 'blockstore-idb';
import { useUser } from '../../../hooks/useUser';
import { LISTING_TAG } from '../../../templates/Post.Listing';
// import useMqtt  from '../../hooks/useMqttMap';

import { useIndexedDB } from "../../../hooks/useIndexedDB";
import useMap from '../../../hooks/useMap';
// const options = {
//   enableHighAccuracy: true,
//   timeout: 5000,
//   maximumAge: 0,
// };
// function success(pos) {
//   const crd = pos.coords;

//   console.log("Your current position is:");
//   console.log(`Latitude : ${crd.latitude}`);
//   console.log(`Longitude: ${crd.longitude}`);
//   console.log(`More or less ${crd.accuracy} meters.`);
// }

// function errors(err) {
//   console.warn(`ERROR(${err.code}): ${err.message}`);
// }

const OpenDelivery = () => {
  const {
    setSize,
    setSelectedPlace
  } = useMap()
  // const [size, setSize] = useState<string[]>(["6400px", "1080px"])
  // const {
  //   // client,
  //   // connect
  //   // disconnect,
  //   // payload,
  //   // isConnected,
  //   // subscriptions,
  //   // addTopic,
  //   // removeTopic
  // } = useMqtt
  const sectionRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!sectionRef.current) return
    if (!sectionRef.current.parentElement) return
    if (!sectionRef.current.parentElement.parentElement) return
    if (!sectionRef.current.parentElement.parentElement.parentElement) return
    setSize([(sectionRef.current.parentElement.clientWidth * .95), (sectionRef.current.parentElement.clientHeight * .95)])
  }, [sectionRef.current?.parentElement])



  const [tags, setTags] = useState<LISTING_TAG[]>([{ type: "Car Delivery" }, { type: "Bike Delivery" }, { type: "Pick Up" }])
  const [store, setStore] = useState<IDBBlockstore>()
  const { user, openLoginDialog, openUserSignatureDialog } = useUser();
  const tagRef = useRef<HTMLInputElement>(null);
  const { encode, put, blockstore, dag } = useIndexedDB({ address: user?.address });
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (!store) return;
    if (!dag) return;
    const streamStore = async () => {
      console.log(store)
      for await (const { cid, block } of store.getAll()) {
        console.log(`got "${cid.toString()}" =`, block)
        return console.log(cid, block)
      }
    }
    streamStore()
  }, [store, dag])
  useEffect(() => {
    if (!blockstore) return;
    if (!dag) return;
    const openStore = async () => {
      await blockstore.open()
      setStore(blockstore)
    }
    openStore()
  }, [blockstore, dag])
  function getForm() {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current)
    let listingYAML = `---\n`
    for (const [key, value] of formData.entries()) {
      console.log({ key, value })
      listingYAML += `${key}: ${value}\n`
    }
    listingYAML += "...\n"
    return listingYAML;
  }
  function addtag(tag: LISTING_TAG) {
    setTags([...tags, tag])
  }
  return (
    <Card className="main-content" style={{ padding: "1rem", backgroundColor: "rgba(255,255,255,.45)" }}>
      <div style={{ textAlign: "center" }}><h1>Open a Delivery Order</h1></div>
      <Form ref={formRef}>
        <Form.Group>
          <Form.Label>Find Address</Form.Label>
          <PlaceAutocompleteClassic onPlaceSelect={setSelectedPlace} />
        </Form.Group>
        <Form.Group style={{ padding: "1rem", display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}>
          {tags.map(({ type }: any, index: number) => {
            return <Form.Check
              key={index}
              type={type}
              label={`${type}`}
              name={type}
              id={`order-type-${type}`}
            />
          })}
        </Form.Group>
        <InputGroup>
          <div style={{ width: "50%" }}>&nbsp;</div>
          <Form.Control
            type="text"
            placeholder="Notes"
            ref={tagRef}
          />
          <Button variant="primary" onClick={() => {
            if (!tagRef.current) throw Error("Still Loaing");
            addtag({ type: tagRef.current.value })
            tagRef.current.value = ""
          }}>
            Add Notes
          </Button>
        </InputGroup>
        <Form.Group>
          <Form.Label>Author</Form.Label>
          <InputGroup>
            {!user && <Button variant="danger" onClick={openLoginDialog}>
              Login
            </Button>}
            <Form.Control
              name="author"
              type="text"
              placeholder="Enter content owner"
              defaultValue={user?.address ?? undefined}
            />
            <Button onClick={() => openUserSignatureDialog(getForm())} disabled={!user}>
              Sign Content
            </Button>
          </InputGroup>
        </Form.Group>
        <Form.Group className="mt-3" style={{ float: "right" }} >
          <Button variant="success" style={{ margin: "0 .5rem" }} onClick={async () => {
            const listingYAML = getForm()
            if (!listingYAML) return;
            const url = window.URL.createObjectURL(new Blob([(await encode(listingYAML)).toString()]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', "listing.yaml");
            document.body.appendChild(link);
            link.click();
          }}>
            Save
          </Button>
          <Button variant="primary" onClick={async () => {
            const listingYAML = getForm()
            if (!listingYAML) return;
            const cid = await put(listingYAML);
            if (!cid) throw new Error("Did not post");
            const dialog = document.createElement('dialog');
            const button = document.createElement('button');
            const br = document.createElement('br');
            dialog.innerHTML = `<p>Your listing has been posted successfully</p>
                    <strong>Listing Page: </strong>
                    <a href="${cid.toString()}">${cid.toString()}</a>
                    `;
            button.innerText = "Close";
            button.addEventListener("click", () => {
              dialog.close();
            })
            button.classList.add("btn")
            button.classList.add("btn-outline-danger")
            button.style.float = "right"
            dialog.prepend(br);
            dialog.prepend(br);
            dialog.prepend(button);
            document.body.appendChild(dialog);
            dialog.open = false;
            dialog.showModal()
          }}>
            Post
          </Button>
        </Form.Group>
      </Form>
    </Card>
  );
};
export default OpenDelivery;