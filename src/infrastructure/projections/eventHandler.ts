import { Event } from '../../eventsourcing/event';

export type EventHandler<E extends Event> = {
  canHandle: (event: Event) => event is E;
  handle: (event: E) => void;
};
