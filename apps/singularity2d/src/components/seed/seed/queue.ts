type Task<T> = {
  promise: Promise<T>;
  priority?: number;
  meta?: any;
};

type ReactiveQueueOptions = {
  maxQueueSize?: number;
  throttleMs?: number;
  debounceMs?: number;
  frameBatching?: boolean;
};

export class ReactiveQueue<T> {
  private queue: Task<T>[] = [];
  private listeners: Map<string, ((e: CustomEvent) => void)[]> = new Map();
  private controller = new AbortController();
  private running = false;
  private debounceTimer: any = null;
  private index = 0;

  constructor(private options: ReactiveQueueOptions = {}) {}

  get size() {
    return this.queue.length;
  }

  on(event: string, handler: (e: CustomEvent) => void) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event)?.push(handler);
  }

  private emit(event: string, detail?: any) {
    const evt = new CustomEvent(event, { detail });
    this.listeners.get(event)?.forEach(fn => fn(evt));
  }

  private async maybeThrottle() {
    if (this.options.throttleMs) {
      await new Promise(res => setTimeout(res, this.options.throttleMs));
    }
  }

  private maybeDebounce(run: () => void) {
    if (this.options.debounceMs) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(run, this.options.debounceMs);
    } else {
      run();
    }
  }

  private runFrame(fn: () => void) {
    if (this.options.frameBatching) {
      requestAnimationFrame(fn);
    } else {
      fn();
    }
  }

  private insertByPriority(task: Task<T>) {
    const idx = this.queue.findIndex(t => (t.priority ?? 0) < (task.priority ?? 0));
    if (idx === -1) this.queue.push(task);
    else this.queue.splice(idx, 0, task);
  }

  push(promise: Promise<T>, meta: { priority?: number; [key: string]: any } = {}) {
    if (this.options.maxQueueSize && this.queue.length >= this.options.maxQueueSize) {
      throw new Error("Queue overflow");
    }

    const task: Task<T> = { promise, priority: meta.priority, meta };

    this.insertByPriority(task);
    this.emit("push", task);

    this.maybeDebounce(() => this.resume());
  }

  pushMany(promises: Promise<T>[], meta: any = {}) {
    for (const p of promises) {
      this.push(p, meta);
    }
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<T> {
    while (!this.controller.signal.aborted) {
      if (this.queue.length === 0) {
        await new Promise<void>(res => {
          const listener = () => {
            this.off("push", listener);
            res();
          };
          this.on("push", listener);
        });
      }

      if (this.queue.length > 0) {
        const task = this.queue.shift()!;
        this.emit("dequeue", task);
        try {
          const result = await task.promise;
          yield result;
        } catch (e) {
          this.emit("error", e);
        }
        await this.maybeThrottle();
      }
    }
  }

  pipe<TOut>(transform: (input: AsyncGenerator<T>) => AsyncGenerator<TOut>) {
    const transformed = transform(this[Symbol.asyncIterator]());
    (async () => {
      for await (const item of transformed) {
        this.emit("pipe", item);
      }
    })();
  }

  resume() {
    if (this.running) return;
    this.running = true;

    this.runFrame(async () => {
      for await (const result of this) {
        this.emit("result", result);
      }
    });
  }

  cancelAll() {
    this.queue.length = 0;
    this.controller.abort();
    this.emit("cancel");
  }

  async awaitIdle() {
    while (this.queue.length > 0) {
      await new Promise(res => setTimeout(res, 10));
    }
  }
}

const clock = new ReactiveQueue<number>({
  maxQueueSize: 144000,
  throttleMs: 100,
//   frameBatching: true,
});

const universe = new ReactiveQueue<number>({
  maxQueueSize: 7,
  throttleMs: 100,
//   frameBatching: true,
});
const heaven = new ReactiveQueue<number>({
  maxQueueSize: 14,
  throttleMs: 100,
//   frameBatching: true,
});
const earth = new ReactiveQueue<number>({
  maxQueueSize: 21,
  throttleMs: 100,
//   frameBatching: true,
});

clock.on("result", e => console.log("Processed:", e.detail));
clock.on("pipe", e => console.log("Piped:", e.detail));

clock.pushMany(
  Array.from({ length: 5 }, (_, i) => 
    new Promise(res => setTimeout(() => res(i), 500 - i * 50)),
  ),
  { priority: 1 }
);

// Pipe to transform
clock.pipe(async function* (source) {
  for await (const val of source) {
    yield val * 2;
  }
});
