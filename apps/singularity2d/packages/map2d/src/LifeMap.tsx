import React, { useState } from 'react';
import { ControlPosition, MapControl } from '@vis.gl/react-google-maps';
import {
  AdvancedMarker,
  APIProvider,
  InfoWindow,
  Map,
  Marker,
  Pin
} from '@vis.gl/react-google-maps';

import ControlPanel from './control-panel';
import { MovingMarker } from './moving-marker';
import { MarkerWithInfowindow } from './marker-with-infowindow';
import { PlaceAutocompleteClassic } from './autocomplete-classic';
import MapHandler from './map-handler';
import useMqtt  from './hooks/useMqtt';

const API_KEY = "AIzaSyDaptZbEnic-pg3UoHagzTihtGkrV9daQ4"

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};
function success(pos) {
  var crd = pos.coords;

  console.log("Your current position is:");
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
}

function errors(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

const LifeMap = () => {
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
    const {
      // client,
      // connect
      // disconnect,
      // payload,
      // isConnected,
      // subscriptions,
      // addTopic,
      // removeTopic
    } = useMqtt
  return (
    <APIProvider apiKey={API_KEY} libraries={['marker']}>
      <Map
        mapId={'bf51a910020fa25a'}
        defaultZoom={13}
        defaultCenter={{ lat: 34.0390107, lng: -118.2672801 }}
        gestureHandling={'greedy'}
        disableDefaultUI>
        {/* simple marker */}
        <Marker
          position={{ lat: 34.0390107, lng: -118.2672801 }}
          clickable={true}
          onClick={() => alert('marker was clicked!')}
          title={'clickable google.maps.Marker'}
        />

        {/* advanced marker with customized pin */}
        <AdvancedMarker
          position={{ lat: 34.0390107, lng: -118.2672801 }}
          title={'AdvancedMarker with customized pin.'}>
          <Pin
            background={'#22ccff'}
            borderColor={'#1e89a1'}
            glyphColor={'#0f677a'}></Pin>
        </AdvancedMarker>

        {/* advanced marker with html pin glyph */}
        <AdvancedMarker
          position={{ lat: 33.9390107, lng: -118.1672801 }}
          title={'AdvancedMarker with customized pin.'}>
          <Pin background={'#22ccff'} borderColor={'#1e89a1'} scale={1.4}>
            {/* children are rendered as 'glyph' of pin */}
            👀
          </Pin>
        </AdvancedMarker>

        {/* advanced marker with html-content */}
        <AdvancedMarker
          position={{ lat: 34.0390107, lng: -118.3672801 }}
          title={'AdvancedMarker with custom html content.'}>
          <div
            style={{
              width: 16,
              height: 16,
              position: 'absolute',
              top: 0,
              left: 0,
              background: '#1dbe80',
              border: '2px solid #0e6443',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)'
            }}></div>
        </AdvancedMarker>

        {/* simple positioned infowindow */}
        <InfoWindow position={{ lat: 34.0890107, lng: -118.2672801 }} maxWidth={200}>
          <p>
            This is the content for another infowindow with <em>HTML</em>
            -element  
          </p>
        </InfoWindow>

        {/* continously updated marker */}
        {/* <MovingMarker /> */}

        {/* simple stateful infowindow */}
        <MarkerWithInfowindow />
        <div className="control-panel">
        </div>
        <MapHandler place={selectedPlace} />
      </Map>


      <MapControl position={ControlPosition.TOP}>
        <div className="autocomplete-control">
          <PlaceAutocompleteClassic onPlaceSelect={setSelectedPlace} />
        </div>
      </MapControl>
    </APIProvider>
  );
};
export default LifeMap;