import { Event } from '../../eventsourcing';

export interface Subscription {
  project(event: Event): void;
}
