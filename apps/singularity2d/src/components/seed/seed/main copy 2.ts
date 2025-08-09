const [queue, control] = createReactiveQueue<string>();

type ReactiveControl<T> = {
  push: (task: Promise<T>) => void;
  stop: () => void;
  done: Promise<void>;
  addEventListener: (event: string, listener: EventListenerOrEventListenerObject) => void;
  removeEventListener: (event: string, listener: EventListenerOrEventListenerObject) => void;
};

function createReactiveQueue<T = any>(): [AsyncGenerator<T, void>, ReactiveControl<T>] {
  const taskQueue: Promise<T>[] = [];
  const eventTarget = new EventTarget();
  let shouldStop = false;

  let resumeQueue: () => void = () => {};
  const done = new Promise<void>(resolve => {
    eventTarget.addEventListener("finish", () => resolve());
  });

  const control: ReactiveControl<T> = {
    push: (task) => {
      taskQueue.push(task);
      resumeQueue(); // resume generator
      eventTarget.dispatchEvent(new CustomEvent("push", { detail: task }));
    },
    stop: () => {
      shouldStop = true;
      resumeQueue();
      eventTarget.dispatchEvent(new Event("finish"));
    },
    done,
    addEventListener: (...args) => eventTarget.addEventListener(...args),
    removeEventListener: (...args) => eventTarget.removeEventListener(...args),
  };

  async function* generator() {
    while (!shouldStop) {
      while (taskQueue.length > 0) {
        const task = taskQueue.shift()!;
        const result = await task;
        eventTarget.dispatchEvent(new CustomEvent("resolve", { detail: result }));
        yield result;
      }

      await new Promise<void>(resolve => (resumeQueue = resolve));
    }
  }

  return [generator(), control];
}

control.addEventListener("push", () => console.log("[Event] Task pushed"));
control.addEventListener("resolve", (e) => console.log("[Event] Task done:", (e as CustomEvent).detail));
control.addEventListener("finish", () => console.log("[Event] Queue finished"));

(async () => {
  for await (const result of queue) {
    console.log("Yielded result:", result);

    if (result === "end") {
      control.stop();
    }
  }
})();

// Push some tasks
control.push(Promise.resolve("first"));
control.push(new Promise(res => setTimeout(() => res("second"), 1000)));
control.push(Promise.resolve("end"));
