import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
// const URL = 'ws://life2d.com:3000';
const URL = 'ws://127.0.0.1:3000';

export const socket = io(URL);