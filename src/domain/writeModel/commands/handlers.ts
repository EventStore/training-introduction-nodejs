import { AggregateStore } from 'src/eventsourcing/aggregateStore';
import {
  CommandHandler,
  NO_COMMAND_HANDLER_REGISTERED,
} from 'src/infrastructure/commands/commandHandler';
import { SlotEvent } from '../events/events';
import { SlotAggregate } from '../slotAggregate';
import { Book, Cancel, Schedule, SlotCommand } from './commands';

export class Handlers implements CommandHandler<SlotCommand> {
  constructor(
    private aggregateStore: AggregateStore<SlotAggregate, SlotEvent>
  ) {}

  handle = (command: SlotCommand): Promise<void> => {
    switch (command.type) {
      case 'schedule':
        return this.schedule(command);
      case 'book':
        return this.book(command);
      case 'cancel':
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
    this.aggregateStore.save(aggregate);
  };

  private book = async ({ data: book }: Book): Promise<void> => {
    const aggregate = await this.aggregateStore.load(book.id);
    aggregate.book(book.patientId);
    this.aggregateStore.save(aggregate);
  };

  private cancel = async ({ data: cancel }: Cancel): Promise<void> => {
    const aggregate = await this.aggregateStore.load(cancel.id);
    aggregate.cancel(cancel.reason, cancel.cancellationTime);
    this.aggregateStore.save(aggregate);
  };
}
