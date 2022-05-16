import { Event } from '../../eventsourcing/event';

export interface Subscription {
  project(event: Event): void;
}
