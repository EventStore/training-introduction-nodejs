import {
  AggregateRoot,
  NO_EVENT_HANDLER_REGISTERED,
} from '../../eventsourcing';
import { SlotEvent, SlotEventType } from './events';

export class SlotAggregate extends AggregateRoot<SlotEvent> {
  public static readonly type = 'SlotAggregate';
  private isBooked = false;
  private isScheduled = false;
  private startTime?: Date;

  schedule = (id: string, startTime: Date, duration: string): void => {
    if (this.isScheduled) {
      throw SLOT_ALREADY_SCHEDULED;
    }
    // raise a correct event here
  };

  cancel = (reason: string, cancellationTime: Date): void => {
    // check whether booked 
    // check whether started
    // raise a correct event here
  };

  book = (patientId: string): void => {
    // check whether scheduled 
    // check whether booked
    // raise a correct event here
  };

  private isStarted = (cancellationTime: Date): boolean =>
    this.startTime !== undefined && cancellationTime > this.startTime;

  protected when = (event: SlotEvent): void => {
    switch (event.type) {
      case SlotEventType.Booked:
        // change state
        break;
      case SlotEventType.Cancelled:
        // change state
        break;
      case SlotEventType.Scheduled:
        // change state
        break;
      default: {
        const _: never = event;
        throw NO_EVENT_HANDLER_REGISTERED;
      }
    }
  };
}

export const SLOT_ALREADY_SCHEDULED = 'SLOT_ALREADY_SCHEDULED';
export const SLOT_NOT_BOOKED = 'SLOT_NOT_BOOKED';
export const SLOT_ALREADY_STARTED = 'SLOT_ALREADY_STARTED';
export const SLOT_NOT_SCHEDULED = 'SLOT_NOT_SCHEDULED';
export const SLOT_ALREADY_BOOKED = 'SLOT_ALREADY_BOOKED';
