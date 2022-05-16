import { Event } from '../../eventsourcing/event';
import { EventHandler } from './eventHandler';

export class Projection<E extends Event> {
  private handlers: Map<string, EventHandler<E>[]> = new Map<
    string,
    EventHandler<E>[]
  >();

  public handle = (event: Event) => {
    const handlers = this.handlers.get(event.type);
    if (!handlers) return;

    for (const handler of handlers
      .filter((h) => h.canHandle(event))
      .map((h) => h.handle))
      handler(<E>event);
  };

  public canHandle = (event: Event): boolean => this.handlers.has(event.type);

  protected when = <T extends E>(
    eventType: string,
    handle: (event: T) => void
  ): void => {
    const handlers = this.handlers.get(eventType) ?? [];

    this.handlers.set(eventType, [
      ...handlers,
      {
        canHandle: (event: Event): event is T => event.type === eventType,
        handle: (event) => handle(<T>event),
      },
    ]);
  };
}
