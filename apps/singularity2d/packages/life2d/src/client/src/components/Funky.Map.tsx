
import {
    AdvancedMarker,
    // APIProvider,
    InfoWindow,
    Marker,
    Pin
  } from '@vis.gl/react-google-maps';
  import { MarkerWithInfowindow } from '../modules/LifeMap/marker-with-infowindow';
  import { MovingMarker } from '../modules/LifeMap/moving-marker';

export default function FunkyMap(){
    return (<>
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
            <MovingMarker />
  
            {/* simple stateful infowindow */}
            <MarkerWithInfowindow />
            <div className="control-panel">
            </div></>)
  }