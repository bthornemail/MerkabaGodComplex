import { useEffect, useCallback, useRef } from 'react';
import { wsService } from '@/services/websocket';

export function useWebSocket() {
  const isConnected = useRef(false);

  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        await wsService.connect();
        isConnected.current = true;
      } catch (error) {
        console.error('Failed to connect WebSocket:', error);
        isConnected.current = false;
      }
    };

    if (!isConnected.current) {
      connectWebSocket();
    }

    return () => {
      wsService.disconnect();
      isConnected.current = false;
    };
  }, []);

  const subscribe = useCallback((eventType: string, callback: (data: any) => void) => {
    wsService.subscribe(eventType, callback);
    return () => wsService.unsubscribe(eventType, callback);
  }, []);

  const send = useCallback((type: string, payload: any) => {
    wsService.send(type, payload);
  }, []);

  return {
    subscribe,
    send,
    isConnected: isConnected.current,
  };
}