/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
// import { useState, useEffect, useLayoutEffect, useRef } from 'react'
// import { Wallet } from '@ethersproject/wallet';
// import { ControlPosition, MapControl } from '@vis.gl/react-google-maps';
import getCurrentPosition from '../modules/LifeMap/bin/get.current.position';

export type MQTT_PAYLOAD = { topic: string, message: string }
export default function useMap(){
  const [ defaultCenter, setDefaultCenter] = useState<{ lat: number, lng: number }>({ lat: 34.0390107, lng: -118.3672801 });
  const [ selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [ center, setCenter] = useState<any>(null);
  const [ currentPosition, setCurrentPosition] = useState<any>(null);
  const [ mapWidth,  setMapWidth ]  = useState<string>("640px")
  const [ mapHeight,  setMapHeight ]  = useState<string>("480px")
  const [ markers,  setMarkers ]  = useState<any[]>([{
    id: "0x",
    position: { lat: 34.0390107, lng: -118.3672801 },
    title: "AdvancedMarker with custom html content.",
    style: {
      width: 16,
      height: 16,
      position: 'absolute',
      top: 0,
      left: 0,
      background: '#1dbe80',
      border: '2px solid #0e6443',
      borderRadius: '50%',
      transform: 'translate(-50%, -50%)'
    }
  }])

  async function _getCurrentPosition(){
    const currentPosition: any = await getCurrentPosition()
    if(!currentPosition) return;
    setCurrentPosition(currentPosition);
    setCenter(currentPosition);
    setMarkers((markers)=>{
      if(markers[0] === markers){
        return markers[0].position = currentPosition
      }
      return markers;
    })
    console.log(currentPosition)
    console.log(markers[0])
    setDefaultCenter((currentPosition))
  }
  function setSize([width, height]:  [number,number]){
    setMapHeight(height + "px")
    setMapWidth(width + "px")
  }
  return { 
    setSize,
    mapWidth,
    mapHeight,
    markers, 
    currentPosition,
    center,
    getCurrentPosition: _getCurrentPosition,
    setMarkers,
    mapId: 'bf51a910020fa25a',
    defaultZoom: 13,
    defaultCenter,
    gestureHandling: 'greedy',
    selectedPlace, 
    setSelectedPlace
  }
}