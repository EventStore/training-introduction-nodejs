import {
  AllStreamResolvedEvent,
  EventStoreDBClient,
} from '@eventstore/db-client';
import { Event } from '../../eventsourcing/event';
import { Subscription } from './subscription';

export class SubscriptionManager {
  private readonly subscriptions: Subscription[];
  constructor(
    private readonly client: EventStoreDBClient,
    ...subscriptions: Subscription[]
  ) {
    this.client = client;
    this.subscriptions = subscriptions;
  }

  start = (): void => {
    this.client.subscribeToAll().on('data', this.eventAppeared);
  };

  private eventAppeared = (resolvedEvent: AllStreamResolvedEvent) => {
    if (!resolvedEvent.event || resolvedEvent.event?.type.startsWith('$'))
      return;

    const event = resolvedEvent.event;

    for (const subscription of this.subscriptions) {
      subscription.project(<Event>{
        type: event.type,
        data: event.data,
        metadata: event.metadata,
      });
    }
  };
}
