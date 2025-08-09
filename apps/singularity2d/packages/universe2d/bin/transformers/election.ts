import { wallets } from '../../test/todo/wallets';
type CANDIDATE = any

const defaultCandidates = Array.from(wallets.keys()) ?? Array.from(new Uint8Array(10).subarray()).map((v, index) => index)
function getElectionGroup(candidates: CANDIDATE[] = defaultCandidates) {
    let delegate: CANDIDATE;
    delegate = candidates[Math.floor(Math.random() * candidates.length)];
    candidates.splice(candidates.indexOf(delegate), 1);
    return { delegate, candidates:[...candidates] };
}
function getElectionGroups(candidates: CANDIDATE[] = defaultCandidates) {
    const count = candidates.length;
    const groups: any[] = []//Array.from({ length: groupCount }, () => []); // Initialize empty groups

    for (let i = 0; i < count; i++) {
        const data = getElectionGroup(candidates);
        // console.log(i, `Delegates & Candidates`, data)
        groups.push(data);
    }

    return groups;
}
console.log(`Election Groups`, getElectionGroups(defaultCandidates))
export {getElectionGroups,getElectionGroup}