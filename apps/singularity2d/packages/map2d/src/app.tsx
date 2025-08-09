import React from 'react';
import {createRoot} from 'react-dom/client';
// import LifeMap from './LifeMap';
import Chat from './Chat';


export function renderToDom(container: HTMLElement) {
  const root = createRoot(container);

  root.render(
    // <React.StrictMode>
      <Chat />
    // </React.StrictMode>
  );
}
