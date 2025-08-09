import { useState } from 'react'
import { useLibp2p } from '../hooks/broker/useLibp2p'

export default function Helia() {
  const [text, setText] = useState('')
  const { error, starting,
    cidString,
    commitText,
    fetchCommittedText,
    committedText
   } = useLibp2p({
    key: Math.random() > .4
      ? {
        key
          : [23, 218, 19, 133, 236, 160, 75, 54, 205, 98, 238, 190, 30, 78, 187, 73, 106, 56, 120, 180, 11, 129, 241, 62, 100, 141, 11, 62, 158, 206, 113, 51]
      }
      : {
        key: [239, 255, 211, 204, 77, 106, 93, 208, 212, 228, 254, 154, 247, 193, 206, 66, 232, 248, 187, 57, 201, 56, 165, 60, 78, 7, 181, 1, 103, 34, 194, 151]
      }
  });

  return (
    <div>
      <div
        id="heliaStatus"
        style={{
          border: `4px solid ${error
              ? 'red'
              : starting ? 'yellow' : 'green'
            }`,
          paddingBottom: '4px'
        }}
      >Helia Status</div>
      <input
        id="textInput"
        value={text}
        onChange={(event) => setText(event.target.value)}
        type="text" />
      <button
        id="commitTextButton"
        onClick={() => commitText(text)}
      >Add Text To Node</button>
      <div
        id="cidOutput"
      >textCid: {cidString}</div>
      {cidString && (<>
        <button
          id="fetchCommittedTextButton"
          onClick={() => fetchCommittedText()}
        >Fetch Committed Text</button>
        <div
          id="committedTextOutput"
        >Committed Text: {committedText}</div>
      </>)
      }

    </div>
  )
}

