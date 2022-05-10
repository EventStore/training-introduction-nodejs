import { Event } from './event';

export const NO_EVENT_HANDLER_REGISTERED = 'NO_EVENT_HANDLER_REGISTERED';

export abstract class AggregateRoot<AggregateEvent extends Event = Event> {
  private changes: AggregateEvent[] = [];
  public id: string | undefined;
  public version = BigInt(-1);

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
