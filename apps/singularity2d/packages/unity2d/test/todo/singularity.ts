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
