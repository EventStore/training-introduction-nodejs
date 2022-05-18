import { PatientSlotsRepository } from '../domain/readModel/patientSlots';
import {
  Booked,
  Cancelled,
  Scheduled,
  SlotEvent,
  SlotEventType,
} from '../domain/writeModel/events/events';
import { Projection } from '../infrastructure/projections/projection';

export class PatientSlotsProjection extends Projection<SlotEvent> {
  constructor(private repository: PatientSlotsRepository) {
    super();
    this.when(SlotEventType.Scheduled, (scheduled: Scheduled) => {
      this.repository.add({
        slotId: scheduled.data.slotId,
        startTime: new Date(scheduled.data.startTime),
        duration: scheduled.data.duration,
      });
    });

    this.when(SlotEventType.Booked, (booked: Booked) =>
      repository.markAsBooked(booked.data.slotId, booked.data.patientId)
    );

    this.when(SlotEventType.Cancelled, (cancelled: Cancelled) =>
      repository.markAsCancelled(cancelled.data.slotId)
    );
  }
}
