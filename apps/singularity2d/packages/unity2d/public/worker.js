const evtSource = new EventSource("/random");
evtSource.onmessage = (event) => {
  const newElement = document.createElement("li");
  const eventList = document.getElementById("list");

  newElement.textContent = `message: ${event.data}`;
  eventList.appendChild(newElement);
};
evtSource.addEventListener("ping", (event) => {
  const newElement = document.createElement("li");
  const eventList = document.getElementById("list");
  const time = JSON.parse(event.data).time;
  newElement.textContent = `ping at ${time}`;
  eventList.appendChild(newElement);
});
onmessage = function(e) {
    console.log('Worker: Message received from main script');
    console.log(e.data);
    // const result = e.data[0] * e.data[1];
    if (isNaN(e.data[0])) {
      postMessage('Please write two numbers');
    } else {
      const workerResult = 'Result: ' + e.data[0];
      console.log('Worker: Posting message back to main script');
      postMessage(workerResult);
    }
    evtSource.close();

  }