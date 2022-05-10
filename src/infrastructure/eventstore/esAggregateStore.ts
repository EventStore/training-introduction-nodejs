import { AggregateRoot } from 'src/eventsourcing/aggregateRoot';
import { AggregateStore } from 'src/eventsourcing/aggregateStore';
import { EventStore } from 'src/eventsourcing/eventStore';

export class ESAggregateStore implements AggregateStore {
  constructor(private store: EventStore) {}

  async save<T extends AggregateRoot>(
    type: string,
    aggregate: T
  ): Promise<void> {
    const streamName = this.getStreamName(type, aggregate.id);
    const changes = aggregate.getChanges();

    await this.store.appendEvents(streamName, aggregate.version, changes);
    aggregate.clearChanges();
  }

  async load<T extends AggregateRoot>(
    type: string,
    aggregateId: string
  ): Promise<T> {
    const streamName = this.getStreamName(type, aggregateId);
    const aggregate: T = { id: aggregateId } as T;

    const events = await this.store.loadEvents(streamName);

    aggregate.load(events);
    aggregate.clearChanges();

    return aggregate;
  }

  private getStreamName(type: string, aggregateId: string) {
    return `${type}-${aggregateId}`;
  }
}
