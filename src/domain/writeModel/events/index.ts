import { Event } from '../../../eventsourcing';

export enum SlotEventType {
  Booked = 'booked',
  Cancelled = 'cancelled',
  Scheduled = 'scheduled',
}

export type Booked = Event<
  SlotEventType.Booked,
  {
  }
>;

export type Cancelled = Event<
  SlotEventType.Cancelled,
  {
  }
>;

export type Scheduled = Event<
  SlotEventType.Scheduled,
  {
    slotId: string;
    startTime: string;
    duration: string;
  }
>;

export type SlotEvent = Booked | Cancelled | Scheduled;
