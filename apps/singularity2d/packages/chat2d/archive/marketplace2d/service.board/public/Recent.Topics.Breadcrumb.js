
export default function RecenTopicsBreadcrumb(TopicNav,activeChannels,setTopic){
	TopicNav.replaceChildren("")
	activeChannels.forEach((channel,topic) => {
		const l = document.createElement("div");
		const li = document.createElement("li");
		const p = document.createElement("a");
		li.classList.add("breadcrumb-item")
		li.classList.add("active")
		p.innerText = `${topic}`;
		p.href = `#${TopicNav.id}`
		li.addEventListener('click',(event)=>{
			setTopic(topic)
		})
		li.append(p)
		TopicNav.append(li);
	})
}