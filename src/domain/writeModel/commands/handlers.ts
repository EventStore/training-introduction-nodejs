import { AggregateStore } from '../../../eventsourcing';
import {
  CommandHandler,
  NO_COMMAND_HANDLER_REGISTERED,
} from '../../../infrastructure/commands';
import { SlotEvent } from '../events';
import { SlotAggregate } from '../slotAggregate';
import {
  Book,
  Cancel,
  Schedule,
  SlotCommand,
  SlotCommandType,
} from './commands';

export class Handlers implements CommandHandler<SlotCommand> {
  constructor(
    private aggregateStore: AggregateStore<SlotAggregate, SlotEvent>
  ) {}

  handle = (command: SlotCommand): Promise<void> => {
    switch (command.type) {
      case SlotCommandType.Schedule:
        return this.schedule(command);
      case SlotCommandType.Book:
        return this.book(command);
      case SlotCommandType.Cancel:
        return this.cancel(command);
      default: {
        const _: never = command;
        throw NO_COMMAND_HANDLER_REGISTERED;
      }
    }
  };

  private schedule = async ({ data: schedule }: Schedule): Promise<void> => {
    const aggregate = await this.aggregateStore.load(schedule.id);
    aggregate.schedule(schedule.id, schedule.startTime, schedule.duration);
    await this.aggregateStore.save(aggregate);
  };

  private book = async ({ data: book }: Book): Promise<void> => {
    // const aggregate = await this.aggregateStore.load(book.id);
    // aggregate.book(book.patientId);
    // await this.aggregateStore.save(aggregate);
  };

  private cancel = async ({ data: cancel }: Cancel): Promise<void> => {
    // const aggregate = await this.aggregateStore.load(cancel.id);
    // aggregate.cancel(cancel.reason, cancel.cancellationTime);
    // await this.aggregateStore.save(aggregate);
  };
}
