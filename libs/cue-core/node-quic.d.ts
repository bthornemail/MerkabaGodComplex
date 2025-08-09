declare module 'node-quic' {
  import { Socket } from 'net';
  
  interface QuicServer {
    listen(port: number, address: string): {
      then(callback: () => void): void;
      onError(callback: (error: any) => void): void;
      onData(callback: (data: any, stream: Socket, buffer: Buffer) => void): void;
    };
    send(port: number, address: string, data: any): {
      then(callback: () => void): void;
      onError(callback: (error: any) => void): void;
      onData(callback: (data: any, buffer: Buffer) => void): void;
    };
  }

  const quic: QuicServer;
  export default quic;
}