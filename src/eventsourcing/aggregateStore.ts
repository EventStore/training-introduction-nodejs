import { AggregateRoot } from './aggregateRoot';
import { Event } from './event';

export interface AggregateStore<T extends AggregateRoot<E>, E extends Event> {
  save(aggregate: T): Promise<void>;
  load(aggregateId: string): Promise<T>;
}
