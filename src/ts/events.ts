type EventQueue<T, V> = {
  handler: (t: T, events: Array<T>) => Promise<V>,
  promise?: Promise<V[]>,
  depth?: number,
};

const addEvents = async <T, V>(eventQueue: EventQueue<T, V>, ...value: T[]): Promise<V[]> => {
  const previousPromise = eventQueue.promise;
  const promise = (async () => {
    eventQueue.depth = (eventQueue.depth || 0) + 1;
    await previousPromise;
    const result: V[] = [];    
    while (value.length) {
      const event = value.shift();
      result.push(await eventQueue.handler(event, value));
    }
    eventQueue.depth--;
    return result;
  })();
  return eventQueue.promise = promise;
}