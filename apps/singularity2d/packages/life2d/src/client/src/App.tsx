/* eslint-disable @typescript-eslint/no-explicit-any */
import { Outlet } from 'react-router-dom'
import ActionBar from './components/Action.Bar.js'
import CurrentTopics from './components/Current.Topics.js'
import Footer from './components/Footer.js'
import MainHeader from './components/Main.Header.js'
import RecentNav from './components/Recent.Nav.js'
import './App.css'
import useChat from './hooks/useChat.js'
import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { socket } from './services/socket.js';
import ContextHUD from './components/Context.HUD.js'
export function ConnectionState({ isConnected }) {
  return <p>State: {'' + isConnected}</p>;
}
export function Events({ events }) {
  return (
    <ul>
      {
        events.map((event, index) =>
          <li key={index}>{event}</li>
        )
      }
    </ul>
  );
}
export function ConnectionManager() {
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
    </>
  );
}
export function MyForm() {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    socket.timeout(5000).emit('message', value, () => {
      setIsLoading(false);
    });
  }

  return (
    <form onSubmit={onSubmit}>
      <input onChange={e => setValue(e.target.value)} />

      <button type="submit" disabled={isLoading}>Submit</button>
    </form>
  );
}
export function SocketApp() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState<any>([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onFooEvent(value) {
      setFooEvents(previous => [...previous, value]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
    };
  }, []);

  return (
    <div className="App">
      <ConnectionState isConnected={isConnected} />
      <Events events={fooEvents} />
      <ConnectionManager />
      <MyForm />
    </div>
  );
}
export function ChatGraph() {
  const cardMessagesRef = useRef<any>(null)
  const {
    // isChatting,
    // setIsChatting,
    chatGraph,
    // currentChat,
    // setTopic,
    // sendMessage
  } = useChat()
  return (<div ref={cardMessagesRef} style={{ height: "auto", width: "100%", padding: ".5rem" }}>
    {/* <p>{JSON.stringify(chatGraph.nodes)}</p> */}
    {chatGraph && chatGraph.nodes?.length > 0 && chatGraph.nodes.map((node: any, index: number) => {
      return <p key={index}>{node.id}:<br /><strong>{node.id}</strong> - {node.message}</p>
    })}
  </div>)
}
export function ContextBox({ contextRef,chatPosition }: any) {
  return (<div id="context-dialog" className="container" ref={contextRef} style={{ width: "100%", overflowY: "auto", maxHeight: "85%", height: "max-content", position: "absolute", bottom: chatPosition.bottom ? Number(chatPosition.bottom) : 0, display: "flex", backgroundColor: "rgba(255,255,255,.85)", zIndex: "1" }} hidden>
    <div className="card" style={{ display: "flex", justifyContent: "space-between", margin: "1rem", minHeight: "min-content" }}>
      <h2>Context Selection</h2>
      <nav className="nav">
        <i className="card" onClick={() => alert('clicked')}>&#9997;</i>
        <i className="card" onClick={() => alert('clicked')}>&curren;</i>
      </nav>
      <button className='btn btn-sm btn-outline-danger' onClick={() => { contextRef.current.hidden = true; }}>Close</button>
    </div>
  </div>)
}
export function ChatRoom({ chatRef, chatPosition }: any) {
  return (<div id="chat-box" ref={chatRef} className='card' style={{ width: "100%", overflowY: "auto", maxHeight: "85%", height: "max-content", position: "absolute", bottom: chatPosition.bottom ? Number(chatPosition.bottom) : 0, display: "flex", backgroundColor: "rgba(255,255,255,.85)", zIndex: "1" }} hidden>
    <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem", minHeight: "min-content" }}>
      <h1>Chat Room</h1>
      <button className='btn btn-sm btn-outline-danger' onClick={() => { chatRef.current.hidden = true; }}>Close</button>
    </div>
    <ChatGraph />
  </div>)
}

function App() {
  const chatRef = useRef<any>(null)
  const actionBarRef = useRef<any>(null)
  const contextRef = useRef<any>(null)
  const [chatPosition, setChatRect] = useState<{ bottom: number }>({ bottom: 0 });
  const {
    isChatting,
    // setIsChatting,
    // chatGraph,
    // currentChat,
    // setTopic,
    // sendMessage
  } = useChat()
  useLayoutEffect(() => {
    if (!actionBarRef.current) return;
    if (!chatRef.current && !chatRef.current?.height) return;
    function getOffset(el: DOMRect) {
      return {
        // left: el.left + window.scrollX + (el.width / 2),
        // top: el.top + window.scrollY + (el.height / 2),
        bottom: Number(el.bottom) + Number(window.scrollY) - Number(chatRef.current?.height / 2)
      };
    }
    const actionBar = actionBarRef.current?.getBoundingClientRect()
    setChatRect(getOffset(actionBar))
  }, [actionBarRef])

  useEffect(() => {
    if (!isChatting) return;
    chatRef.current.hidden = false
  }, [isChatting])

  return (<main id="vault_ai-app">
    <MainHeader />
    <RecentNav />
    <CurrentTopics />
    <section ref={actionBarRef} id="main-view" className="card" style={{ height: "100%", width: "100%", minHeight: "75vh", maxHeight: "75vh", overflowY: "auto" }}>
      <Outlet />
      <ContextHUD chatPosition={chatPosition} contextRef={contextRef} />
      <ChatRoom chatRef={chatRef} chatPosition={chatPosition} />
    </section>
    <div style={{ textAlign: "center", width: "80%" }}>
      Current Topic: <strong>{"public"}</strong>
    </div>
    <ActionBar toggleChat={() => {
      if (chatRef.current) {
        chatRef.current.hidden = !chatRef.current.hidden;
      }
    }} toggleContext={() => {
      console.log("Context")
      if (contextRef.current) {
        contextRef.current.hidden = !contextRef.current.hidden;
      }
    }} contextRef={contextRef} />
    <Footer />
  </main>)
}
export default App
