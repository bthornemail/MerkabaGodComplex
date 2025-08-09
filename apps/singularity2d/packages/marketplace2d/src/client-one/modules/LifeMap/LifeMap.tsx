/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';
// import { useEffect, useRef, useState } from 'react';
import { ControlPosition, MapControl } from '@vis.gl/react-google-maps';
import {
  // AdvancedMarker,
  APIProvider,
  // InfoWindow,
  Map,
  Marker,
  // Pin
} from '@vis.gl/react-google-maps';

// import ControlPanel from './control-panel';
// import { MovingMarker } from './moving-marker';
// import { MarkerWithInfowindow } from './marker-with-infowindow';
import MapHandler from './map-handler';
import useMap from '../../hooks/useMap';
import { IDBBlockstore } from 'blockstore-idb';
import { useUser } from '../../hooks/useUser';
// import useMqtt  from '../../hooks/useMqttMap';

import { useIndexedDB } from "../../hooks/useIndexedDB";
// import OpenDelivery from './Open.Delivery';
import { PlaceAutocompleteClassic } from './autocomplete-classic';
const API_KEY = "AIzaSyDaptZbEnic-pg3UoHagzTihtGkrV9daQ4"

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

const LifeMap = () => {
  const {
    setSize,
    mapWidth,
    mapHeight,
    markers,
    // setMarkers,
    mapId,
    center,
    defaultZoom,
    defaultCenter,
    gestureHandling,
    selectedPlace,
    setSelectedPlace
  } = useMap()
  const sectionRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!sectionRef.current) return
    if (!sectionRef.current.parentElement) return
    if (!sectionRef.current.parentElement.parentElement) return
    if (!sectionRef.current.parentElement.parentElement.parentElement) return
    setSize([(sectionRef.current.parentElement.clientWidth * .95), (sectionRef.current.parentElement.clientHeight * .95)])
  }, [sectionRef.current?.parentElement])

  const [store, setStore] = useState<IDBBlockstore>()
  const { user } = useUser();
  const { blockstore, dag } = useIndexedDB({ address: user?.address });
  // const { encode, put, blockstore, dag } = useIndexedDB({ address: user?.address });
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
  return (
    <div ref={sectionRef} style={{ width: mapWidth, height: mapHeight,margin:"0 auto",display:"flex",alignItems:"center"}}>
      <APIProvider apiKey={API_KEY} libraries={['marker']}>
        <Map
          mapId={mapId}
          defaultZoom={defaultZoom}
          defaultCenter={defaultCenter}
          center={center}
          gestureHandling={gestureHandling}
          disableDefaultUI>
          {markers.map((marker: any, index: number) => (
            <Marker
              key={index}
              position={marker.position}
              clickable={true}
              onClick={() => alert(marker.id + ' marker was clicked!')}
              title={marker.title}
            />))}
          <MapHandler place={selectedPlace} />
        </Map>
        <MapControl position={ControlPosition.TOP}>
          <div className="" >
            <PlaceAutocompleteClassic onPlaceSelect={setSelectedPlace} />
          </div>
        </MapControl>
      </APIProvider>
    </div>
  );
};
export default LifeMap;