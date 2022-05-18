import { AvailableSlotsRepository } from '../domain/readModel/availableSlots';
import {
  Booked,
  Scheduled,
  SlotEvent,
  SlotEventType,
} from '../domain/writeModel/events/events';
import { Projection } from '../infrastructure/projections/projection';

export class AvailableSlotsProjection extends Projection<SlotEvent> {
  constructor(private repository: AvailableSlotsRepository) {
    super();
    this.when(SlotEventType.Scheduled, (scheduled: Scheduled) => {
      this.repository.add({
        slotId: scheduled.data.slotId,
        startTime: new Date(scheduled.data.startTime),
        duration: scheduled.data.duration,
      });
    });

    this.when(SlotEventType.Booked, (booked: Booked) =>
      repository.markAsUnavailable(booked.data.slotId)
    );

    this.when(SlotEventType.Cancelled, (cancelled) =>
      repository.markAsAvailable(cancelled.data.slotId)
    );
  }
}
