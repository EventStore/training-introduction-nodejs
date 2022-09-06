import { Event } from '../../eventsourcing';

export type EventHandler<E extends Event> = {
  canHandle: (event: Event) => event is E;
  handle: (event: E) => void;
};
