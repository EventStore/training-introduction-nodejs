import { Event } from '../../../eventsourcing/event';

export enum SlotEventType {
  Booked = 'booked',
  Cancelled = 'cancelled',
  Scheduled = 'scheduled',
}

export type Booked = Event<
  SlotEventType.Booked,
  {
    slotId: string;
    patientId: string;
  }
>;

export type Cancelled = Event<
  SlotEventType.Cancelled,
  {
    slotId: string;
    reason: string;
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
