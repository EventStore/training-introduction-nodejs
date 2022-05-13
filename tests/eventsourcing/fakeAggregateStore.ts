import { AggregateRoot } from '../../src/eventsourcing/aggregateRoot';
import { AggregateStore } from '../../src/eventsourcing/aggregateStore';
import { Event } from '../../src/eventsourcing/event';

export class FakeAggregateStore<T extends AggregateRoot<E>, E extends Event>
  implements AggregateStore<T, E>
{
  constructor(private readonly aggregate: T) {}

  save = (_: T): Promise<void> => Promise.resolve();

  load = (_: string): Promise<T> => Promise.resolve(this.aggregate);
}
