/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
/* eslint-disable react-hooks/exhaustive-deps */
// import App from './App.tsx'
import { useRef } from 'react'
import './Graph.css'
// import socialMediaData from './datasets/social.media.json';
// import userProfileData from './datasets/cloud.user.json';
import useMqttChat from '../hooks/useMqttChat.tsx';
import { useGraph } from '../hooks/useGraph.tsx';
export type NODE_GRAPH = { nodes: any[], links: any[] }
export type NODE_GRAPH_NODE = { node: Record<string, any>, link: Record<string, any> }
export type GRAPH_DATA = { nodes: any[], links: any[] }
export default function TopicSelector() {
      const selectTopicRef = useRef<HTMLInputElement>(null);
      const topicRef = useRef<HTMLInputElement>(null);
      const messageRef = useRef<HTMLInputElement>(null);
      const { graphData, updateGraphData } = useGraph()
      const { subscriptions, addTopic, removeTopic } = useMqttChat({ graphData, updateGraphData });
      return (<form className="card" onSubmit={(event: any) => {
            event.preventDefault()
            if (!selectTopicRef.current?.value) throw new Error("No Input Detected");
            addTopic(`Social_Media:${selectTopicRef.current?.value}`);
            event.currentTarget.reset()
      }}>
            {Array.from(subscriptions).map((topic: string) => <button onClick={() => removeTopic(topic)} className="btn btn-light">{topic}</button>)}
            <input ref={selectTopicRef} placeholder={"Enter new topic"} />
            <div className="input-group">
                  <input ref={topicRef} placeholder={"Enter new topic"} />
                  <input ref={messageRef} placeholder={"Enter message"} />
                  <button type="submit" className="btn btn-light">Submit</button>
            </div>
      </form>)
}