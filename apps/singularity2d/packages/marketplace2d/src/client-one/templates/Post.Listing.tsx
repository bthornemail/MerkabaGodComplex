/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react"
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import { useIndexedDB as useDb } from "../hooks/useIndexedDB";
import { IDBBlockstore } from "blockstore-idb";
import { useUser } from "../hooks/useUser";
import { useGraphStore } from "../hooks/useGraphStore";
import { useStore } from "../hooks/useStore";

export type LISTING_TAG = { type: string }
const PostListing: React.FC = () => {
    const [tags, setTags] = useState<LISTING_TAG[]>([{ type: "asset" }, { type: "service" }, { type: "course" }])
    const [store, setStore] = useState<IDBBlockstore>()
    const { user, openLoginDialog, openUserSignatureDialog } = useUser();
    const tagRef = useRef<HTMLInputElement>(null);
    const { encode, put, blockstore, dag } = useStore();
    const formRef = useRef<HTMLFormElement>(null);
    const { graph, addNode,addLink, view }  = useGraphStore()
    useEffect(() => {
        console.log(graph)
    })
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
            <div style={{ textAlign: "center" }}><h1>Post Content</h1></div>
            <Form ref={formRef}>
                <Form.Group>
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Title"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Summary</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Summary"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Description"
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Image"
                    />
                </Form.Group>
                <Form.Group style={{ padding: "1rem", display: "grid",gridTemplateColumns:"1fr 1fr 1fr"}}>
                    {tags.map(({ type }: any, index: number) => {
                        return <Form.Check
                            key={index}
                            type={type}
                            label={`tag ${type}`}
                            name={type}
                            id={`tag-${type}`}
                        />
                    })}
                </Form.Group>
                <InputGroup>
                    <div style={{ width: "50%" }}>&nbsp;</div>
                    <Form.Control
                        type="text"
                        placeholder="Content"
                        ref={tagRef}
                    />
                    <Button variant="primary" onClick={() => {
                        if (!tagRef.current) throw Error("Still Loaing");
                        addtag({ type: tagRef.current.value })
                        tagRef.current.value = ""
                    }}>
                        Add Tag
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
                    {/* <Button variant="success" style={{ margin: "0 .5rem" }} onClick={async () => {
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
                    </Button> */}
                    <Button variant="primary" onClick={async () => {
                        const listingYAML = getForm()
                        if (!listingYAML) return;
                        await addNode("identity",listingYAML)
                        const cid = await put(graph);
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
export default PostListing;