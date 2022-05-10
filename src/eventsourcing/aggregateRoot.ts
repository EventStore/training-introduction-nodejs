import { Event } from './event';

export const NoHandlerRegisteredException = 'NoHandlerRegisteredException';

export abstract class AggregateRoot {
  private handlers: Map<string, (event: Event) => void> = new Map<
    string,
    (event: Event) => void
  >();
  private changes: Event[] = [];
  public version = BigInt(-1);

  constructor(public id: string) {}

  protected register = (
    eventType: string,
    when: (event: Event) => void
  ): void => {
    this.handlers.set(eventType, when);
  };

  protected raise = (e: Event): void => {
    const handler = this.handlers.get(e.type);

    if (!handler) {
      throw NoHandlerRegisteredException;
    }

    handler(e);
    this.changes.push(e);
  };

  getChanges = () => this.changes;

  load = (history: Event[]) => {
    for (const e of history) {
      this.raise(e);
      this.version++;
    }
  };

  clearChanges = () => {
    this.changes = [];
  };
}
