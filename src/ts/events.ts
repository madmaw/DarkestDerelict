type EventQueue<T, V> = {
  handler: (t: T, events: Array<T>) => Promise<V>,
  events: Array<T>,
  active?: T | undefined,
  activeStartTime?: number | undefined,
};

const addEvents = async <T, V>(eventQueue: EventQueue<T, V>, ...value: T[]): Promise<V[]> => {
  const events = eventQueue.events;
  const result: V[] = [];
  events.push(...value);
  if (!eventQueue.active) {
    eventQueue.active = events.shift();
    do {
      result.push(await eventQueue.handler(eventQueue.active, events));
      eventQueue.active = events.shift();
    } while (eventQueue.active);
  }
  return result;
}