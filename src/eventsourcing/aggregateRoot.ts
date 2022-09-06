import { Event } from './event';

export const NO_EVENT_HANDLER_REGISTERED = 'NO_EVENT_HANDLER_REGISTERED';
export const AGGREGATE_ID_IS_NOT_SET = 'AGGREGATE_ID_IS_NOT_SET';

export abstract class AggregateRoot<AggregateEvent extends Event = Event> {
  private changes: AggregateEvent[] = [];
  private aggregateId: string | undefined;
  public version = BigInt(-1);

  public get id() {
    if (!this.aggregateId) throw AGGREGATE_ID_IS_NOT_SET;

    return this.aggregateId;
  }

  public set id(aggregateId: string) {
    this.aggregateId = aggregateId;
  }

  getChanges = () => this.changes;

  load = (history: AggregateEvent[]) => {
    for (const e of history) {
      this.raise(e);
      this.version++;
    }
  };

  clearChanges = () => {
    this.changes = [];
  };

  protected raise = (e: AggregateEvent): void => {
    this.when(e);
    this.changes.push(e);
  };

  protected abstract when(event: AggregateEvent): void;
}
