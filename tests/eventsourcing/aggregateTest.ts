import { AggregateRoot, AggregateStore, Event } from '../../src/eventsourcing';
import {
  Command,
  CommandHandlerMap,
  Dispatcher,
} from '../../src/infrastructure/commands';
import { FakeAggregateStore } from './fakeAggregateStore';

export type AggregateTest<
  A extends AggregateRoot<E>,
  E extends Event,
  C extends Command
> = (...events: E[]) => AggregateTestRunner<A, E, C>;

export const Given =
  <A extends AggregateRoot<E>, E extends Event, C extends Command>(
    aggregate: A,
    getCommandHandlerMap: (
      aggregateStore: AggregateStore<A, E>
    ) => CommandHandlerMap
  ) =>
  (...events: E[]) => {
    const aggregateStore = new FakeAggregateStore<A, E>(aggregate);
    const commandHandlerMap = getCommandHandlerMap(aggregateStore);
    const dispatcher = new Dispatcher(commandHandlerMap);

    aggregate.load(events);
    return new AggregateTestRunner<A, E, C>(aggregate, dispatcher);
  };

class AggregateTestRunner<
  A extends AggregateRoot<E>,
  E extends Event,
  C extends Command
> {
  private exception?: unknown;
  private command?: C;

  constructor(
    private readonly aggregate: A,
    private readonly dispatcher: Dispatcher
  ) {}

  public when = (command: C): AggregateTestRunner<A, E, C> => {
    this.aggregate.clearChanges();

    this.command = command;

    return this;
  };

  public then = async (assert: (events: E[]) => void): Promise<void> => {
    await this.dispatchCommand();
    if (this.exception) {
      throw this.exception;
    }

    assert(this.aggregate.getChanges());
  };

  public thenThrows = async (exeption: string): Promise<void> => {
    await this.dispatchCommand();
    expect(this.exception).toEqual(exeption);
  };

  private dispatchCommand = async () => {
    if (!this.command) {
      expect(this.command).toBeDefined();
      return;
    }
    try {
      await this.dispatcher.dispatch(this.command);
    } catch (e) {
      this.exception = e;
    }
  };
}
