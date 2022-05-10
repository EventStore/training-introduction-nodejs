import { AggregateRoot } from './aggregateRoot';

export interface AggregateStore {
  save<T extends AggregateRoot>(type: string, aggregate: T): Promise<void>;
  load<T extends AggregateRoot>(type: string, aggregateId: string): Promise<T>;
}
