import notifyMe from './notify.me.js'

export default async function onClientMessage(topic,message,signer){
    if (!topic.startsWith(`/${signer.publicKey}`)) return;
    console.log("New Message recieved")
    console.log("topic",topic);
    console.log("message: ", message.toString());
    const img = "/src/images/play-stream-svgrepo-com.svg";
    const notification = notifyMe(topic.split("/")[0], { body: message.toString(), icon: img });
    if (DatastoreIdb) {
        const store = new DatastoreIdb.IDBDatastore(topic.split("/")[0]);
        await store.open();
        await store.put(topic, message)
        await store.close();
        return notification;
    }
}