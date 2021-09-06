type EventQueue<T, V> = {
  handler: (t: T, events: Array<T>) => Promise<V>,
  promise?: Promise<V[]>,
  requestDepth?: number,
};

const addEvents = async <T, V>(eventQueue: EventQueue<T, V>, ...value: T[]): Promise<V[]> => {
  const previousPromise = eventQueue.promise;
  const promise = (async () => {
    eventQueue.requestDepth = (eventQueue.requestDepth || 0) + 1;
    await previousPromise;
    const result: V[] = [];    
    while (value.length) {
      const event = value.shift();
      result.push(await eventQueue.handler(event, value));
    }
    eventQueue.requestDepth--;
    return result;
  })();
  return eventQueue.promise = promise;
}