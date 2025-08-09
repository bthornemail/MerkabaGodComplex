import { wallets } from '../../test/todo/wallets';
type Publisher = any
const defaultSubscribers =  Array.from(wallets.keys()) ?? Array.from(new Uint8Array(7).subarray()).map((v, index) => index)
function getBroadcastGroup(subscribers: Publisher[] = defaultSubscribers) {
    let publisher: Publisher;
    publisher = subscribers[Math.floor(Math.random() * subscribers.length)];
    subscribers.splice(subscribers.indexOf(publisher), 1);
    return { publisher, subscribers:[...subscribers] };
}
function getBroadcastGroups(subscribers: Publisher[] = defaultSubscribers) {
    return subscribers.map((subscriber)=>{
        return getBroadcastGroup([...subscribers])
    }).filter(subscriber=>subscriber)
}


console.log(`Broadcast Groups`, getBroadcastGroups(defaultSubscribers))
// console.log(`Broadcast Group`, getBroadcastGroup(defaultSubscribers))
export {getBroadcastGroups,getBroadcastGroup}