import { AvailableSlotsRepository } from '../domain/readModel/availableSlots';
import {
  Booked,
  Scheduled,
  SlotEvent,
  SlotEventType,
} from '../domain/writeModel/events';
import { Projection } from '../infrastructure/projections/';

export class AvailableSlotsProjection extends Projection<SlotEvent> {
  constructor(private repository: AvailableSlotsRepository) {
    super();
    this.when(SlotEventType.Scheduled, (scheduled: Scheduled) => {
      this.repository.add({});
    });

    // this.when(SlotEventType.Booked, (booked: Booked) =>
    //  
    // );
  }
}
