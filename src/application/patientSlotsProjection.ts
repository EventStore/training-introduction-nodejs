import { PatientSlotsRepository } from '../domain/readModel/patientSlots';
import {
  Booked,
  Cancelled,
  Scheduled,
  SlotEvent,
  SlotEventType,
} from '../domain/writeModel/events';
import { Projection } from '../infrastructure/projections';

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
  }
}
