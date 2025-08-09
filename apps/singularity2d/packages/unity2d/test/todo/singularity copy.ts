import Person from '../../../unity2d/types/environment/Person'
// Example usage
const brian = new Person({identity:'Brian'});
// brian.createWord('Hey Ollama Im going to get you a buddy');
// brian.createUser('Ollama');
brian.sendMessage({
    action: "spawn-worker",
    text: "Hey Ollama Im going to get you a buddy"
});
brian.sendMessage({
    action: "create-wallet",
    // text: "Hey Ollama Im going to get you a buddy"
});
// const grok = myWorker.spawnWorker('Grok');
// grok.postMessage('Hey Grok Im going to get you a buddy');
function *god(beliefs: JSON){
    yield 
}
function *God(){
    const reality = {}
    yield [god,reality]
}
function *GOD(){
    const LawsOfNature = {};
    yield [God,LawsOfNature]
}
class _GOD {
    omniscient = (entity,action,time,environment)=>[
        [entity,action],
        [entity,time],
        [entity,environment],
        [action,time],
        [action,environment],
        [time,environment]
    ]
    omnipotent = (data: AsyncGenerator)=>{return ({observe,request,respond})=>data.next(observe ?? request ?? respond)}
    omnipresent = (query:string,timestamp:number)=>true;
} 
