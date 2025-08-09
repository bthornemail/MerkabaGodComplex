/* eslint-disable @typescript-eslint/no-explicit-any */
// import {  useState} from 'react'

export default function TopicsView(props: any) {
  return (<div className="card">
    <div id="topics" className="card">
      <details className="card">
        <summary>Latest Topics</summary>
        <ul id="latest-topics" className="card"></ul>
      </details>
      <details className="card">
        <summary>Popular Topics</summary>
        <ul id="popular-topics" className="card"></ul>
      </details>
      <details className="card">
        <summary>Default Topics</summary>
        <ul id="default-topics" className="card"></ul>
      </details>
    </div>
  </div>)
}