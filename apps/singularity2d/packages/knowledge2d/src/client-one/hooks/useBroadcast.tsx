/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from 'react'
import { BroadcastContext } from '../provider/Broadcast.Provider.tsx'
export const useBroadcast = () => {
  const {
    isConnected,
    message,
    messageQueue,
    currentChannel,
    activeChannels,

    addChannel,
    removeChannel,
    publishToChannel,
    viewChannel,
  } = useContext(BroadcastContext) as unknown as any
  return {
    isConnected,
    message,
    messageQueue,
    currentChannel,
    activeChannels,

    addChannel,
    removeChannel,
    publishToChannel,
    viewChannel,
  } 
}
