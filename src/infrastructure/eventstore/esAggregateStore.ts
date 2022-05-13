import { AggregateRoot } from '../../eventsourcing/aggregateRoot';
import { AggregateStore } from '../../eventsourcing/aggregateStore';
import { Event } from '../../eventsourcing/event';
import { EventStore } from '../../eventsourcing/eventStore';

export class ESAggregateStore<T extends AggregateRoot<E>, E extends Event>
  implements AggregateStore<T, E>
{
  constructor(private store: EventStore, private streamPrefix: string) {}

  async save(aggregate: T): Promise<void> {
    const streamName = this.getStreamName(this.streamPrefix, aggregate.id!);
    const changes = aggregate.getChanges();

    await this.store.appendEvents(streamName, aggregate.version, changes);
    aggregate.clearChanges();
  }

  async load(aggregateId: string): Promise<T> {
    const streamName = this.getStreamName(this.streamPrefix, aggregateId);
    const aggregate: T = { id: aggregateId } as T;

    const events = await this.store.loadEvents<E>(streamName);

    aggregate.load(events);
    aggregate.clearChanges();

    return aggregate;
  }

  private getStreamName(type: string, aggregateId: string) {
    return `${type}-${aggregateId}`;
  }
}
