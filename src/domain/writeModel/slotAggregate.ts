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

    this.raise({
      type: SlotEventType.Scheduled,
      data: {
        slotId: id,
        startTime: startTime.toISOString(),
        duration,
      },
    });
  };

  cancel = (reason: string, cancellationTime: Date): void => {
    if (!this.isBooked) {
      throw SLOT_NOT_BOOKED;
    }

    if (this.isStarted(cancellationTime)) {
      throw SLOT_ALREADY_STARTED;
    }

    if (this.isBooked && !this.isStarted(cancellationTime)) {
      this.raise({
        type: SlotEventType.Cancelled,
        data: {
          slotId: this.id,
          reason,
        },
      });
    }
  };

  book = (patientId: string): void => {
    if (!this.isScheduled) {
      throw SLOT_NOT_SCHEDULED;
    }

    if (this.isBooked) {
      throw SLOT_ALREADY_BOOKED;
    }

    this.raise({
      type: SlotEventType.Booked,
      data: {
        slotId: this.id,
        patientId,
      },
    });
  };

  private isStarted = (cancellationTime: Date): boolean =>
    this.startTime !== undefined && cancellationTime > this.startTime;

  protected when = (event: SlotEvent): void => {
    switch (event.type) {
      case SlotEventType.Booked:
        this.isBooked = true;
        break;
      case SlotEventType.Cancelled:
        this.isBooked = false;
        break;
      case SlotEventType.Scheduled:
        this.isScheduled = true;
        this.startTime = new Date(event.data.startTime);
        this.id = event.data.slotId;
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
