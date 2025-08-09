type Mentor = {
    id: number
}

function setGroupPublisher(_peers: Mentor[] = [],isElection = false) {
    let peers;
    if(!isElection){
        peers = _peers.length > 0
        ? [..._peers]
        : [...Array.from(new Uint8Array(4).subarray()).map((v, index) => {
            return {
                id: index
            }
        })]
    } else {
        peers = _peers.length > 0
        ? _peers
        : Array.from(new Uint8Array(4).subarray()).map((v, index) => {
            return {
                id: index
            }
        })
    }
    let publisher: Mentor;
    // for (let i = 0; i < peers.length; i++) {
    // const candidate = peers[Math.floor(Math.random() * peers.length)];
    publisher = peers[Math.floor(Math.random() * peers.length)];
    // console.log(`Promoted--------`, { candidate })
    // publishers[peers.indexOf(candidate)] = candidate;
    peers.splice(peers.indexOf(publisher), 1);
    // }
    return { publisher, peers };
}
function pullPublisherGroup(_peers: Mentor[] = []) {
    const peers = _peers.length > 0
        ? _peers
        : Array.from(new Uint8Array(4).subarray()).map((v, index) => {
            return {
                id: index
            }
        })
    const publishers = {}
    for (let i = 0; i < peers.length; i++) {
        const publisher = peers[Math.floor(Math.random() * peers.length)];
        // console.log(`Promoted--------`, { publisher })
        publishers[peers.indexOf(publisher)] = publisher;
        peers.splice(peers.indexOf(publisher), 1);
    }
    return { publishers, peers };
}
function getPublisherGroups(groupCount: number = 5, publisherCount = 100) {
    const peers: Mentor[] = Array.from(new Uint8Array(publisherCount)).map((v, index) => ({
        id: index
    }));
    const groups: Mentor[][] = Array.from({ length: groupCount }, () => []); // Initialize empty groups

    for (let i = 0; i < peers.length; i++) {
        const randomGroupIndex = Math.floor(Math.random() * groupCount); // Randomly select a group index
        groups[randomGroupIndex].push(peers[i]); // Assign the peer to the chosen group
    }

    return groups;
}


// console.log(`Groups:        `, getPublisherGroups());
getPublisherGroups(2,10).forEach((group,index)=>{
    console.log("Group",index)
    // console.log(`Publishers & Peers`, pullPublisherGroup(group))
    console.log(`Publishers & Peers`, setGroupPublisher(group))
    console.log()
})
getPublisherGroups(2,10).forEach((group,index)=>{
    console.log("Group",index)
    console.log(`Publishers & Peers`, pullPublisherGroup(group))
    // console.log(`Publishers & Peers`, setGroupPublisher(group))
    console.log()
})