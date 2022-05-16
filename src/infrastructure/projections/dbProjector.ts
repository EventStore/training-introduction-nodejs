import { Event } from '../../eventsourcing/event';
import { Projection } from './projection';
import { Subscription } from './subscription';

export class DbProjector<E extends Event> implements Subscription {
  constructor(private readonly projection: Projection<E>) {}

  project(event: Event) {
    if (this.projection.canHandle(event)) {
      this.projection.handle(event);
    }
  }
}
