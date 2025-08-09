/* eslint-disable react-hooks/exhaustive-deps */
import './App.css'
import { useCallback, useRef, useState } from 'react'
import { useAceBase } from './hooks/useAceBase'

export default function AcebBaseDB() {
  const { db } = useAceBase("root");
  const topicInput = useRef<HTMLInputElement>(null);
  const msgInput = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<string[]>([]);
  async function startTransaction() {
    if (!db) return;
    // Run transaction on balance only, reduces amount of data being loaded, transferred, and overwritten
    db.ref('accounts/some_account/balance')
      .transaction(snapshot => {
        let balance = snapshot.val();
        if (balance === null) { // snapshot.exists() === false
          balance = 0;
        }
        return balance * 1.02;    // Add 2% interest
      });
  }
  const push = useCallback(async () => {
    if (!db) return;
    if (!topicInput.current?.value) return;
    if (!msgInput.current?.value) return;
    const ref = await db.ref(topicInput.current.value)
      .push({
        name: msgInput.current.value,
        type: "message"
      })
    console.log(`"${ref.path}" was saved!`);
    setData(data.concat(`"${ref.path}" was saved!\n`))
  }, [db])
  const set = useCallback(async () => {
    if (!db) return;
    if (!topicInput.current?.value) return;
    if (!msgInput.current?.value) return;
    const ref = await db.ref(topicInput.current.value).set({
      test: msgInput.current.value
    });
    console.log(`"${ref.path}" was saved!`);
    setData(data.concat(`"${ref.path}" was saved!\n`))
  }, [db])
  const get = useCallback(async () => {
    if (!db) return;
    if (!topicInput.current?.value) return;
    const snapshot = await db.ref(topicInput.current.value).get();
    setData(data.concat(`Got "${snapshot.ref.path}" value:, ${JSON.stringify(snapshot.val())}\n`));
    console.log(`Got "${snapshot.ref.path}" value:`, snapshot.val());
  }, [db])
  const view = useCallback(async () => {
    if (!db) return;
    // Stream all books one at a time (loads all data for each book):
    
    if (!topicInput.current?.value) return;
      await db.ref(topicInput.current.value).forEach(bookSnapshot => {
      const book = bookSnapshot.val();
      console.log(`Got book "${book.title}": "${book.description}"`);
      setData(data.concat(`Got "${bookSnapshot.ref.path}" value:, ${JSON.stringify(bookSnapshot.val())}\n`));
      console.log(`Got "${bookSnapshot.ref.path}" value:`, bookSnapshot.val());
    });

    // // Now do the same but only load 'title' and 'description' of each book:
   
    // if (!topicInput.current?.value) return;
    // const ref = await db.ref(topicInput.current.value).forEach(
    //   { include: ['title', 'description'] },
    //   bookSnapshot => {
    //     const book = bookSnapshot.val();
    //     console.log(`Got book "${book.title}": "${book.description}"`);
    //   }
    // );

  }, [db])
  const subscribe = useCallback(async () => {
    if (!db) return;
    if (!topicInput.current?.value) return;
    const subscription = db.ref(topicInput.current.value)
      .on('child_added')
      .subscribe(snapshot => {
        setData(data.concat(`Got "${snapshot.ref.path}" value:, ${JSON.stringify(snapshot.val())}\n`));
        console.log(`Got "${snapshot.ref.path}" value:`, snapshot.val());
      });

    // Use activated promise
    subscription.activated()
      .then(() => {
        if (!topicInput.current?.value) return;
        if (!msgInput.current?.value) return;
        // We now know for sure the subscription is active,
        // adding a new user will trigger the .subscribe callback
        db.ref(topicInput.current.value).push({ name: msgInput.current?.value });
      })
      .catch(err => {
        // Access to path denied by server?
        console.error(`Subscription canceled: ${err.message}`);
      });
  }, [db])
  return (<div id="vault_ai-app">
    {data}
    <div className="input-group">
    <input placeholder='Topic'  className="form-control" ref={topicInput} />
    <input placeholder='Message'  className="form-control" ref={msgInput} />
    </div>
    <button className="btn btn-outline-light" onClick={push}>Push</button>
    <button className="btn btn-outline-light" onClick={set}>Set</button>
    <button className="btn btn-outline-light" onClick={get}>Get</button>
    <button className="btn btn-outline-light" onClick={view}>View</button>
    <button className="btn btn-outline-light" onClick={subscribe}>Subscribe</button>
    <button className="btn btn-outline-light" onClick={startTransaction}>Start Transaction</button>
  </div>
  )
}
