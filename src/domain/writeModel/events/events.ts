import { Event } from '../../../eventsourcing/event';

export type Booked = Event<
  'booked',
  {
    slotId: string;
    patientId: string;
  }
>;

export type Cancelled = Event<
  'cancelled',
  {
    slotId: string;
    reason: string;
  }
>;

export type Scheduled = Event<
  'scheduled',
  {
    slotId: string;
    startTime: Date;
    duration: string;
  }
>;

export type SlotEvent = Booked | Cancelled | Scheduled;
