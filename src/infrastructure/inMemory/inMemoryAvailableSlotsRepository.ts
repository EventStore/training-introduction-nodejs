import {
  AvailableSlot,
  AvailableSlotsRepository,
} from '../../domain/readModel/availableSlots';

export class InMemoryAvailableSlotsRepository
  implements AvailableSlotsRepository
{
  private available: AvailableSlot[] = [];
  private booked: AvailableSlot[] = [];

  add = (availableSlot: AvailableSlot): void => {
    this.available.push(availableSlot);
  };

  markAsUnavailable = (slotId: string): void => {
    // const slot = this.available.find((s) => s.slotId === slotId);
    //
    // if (!slot) return;
    //
    // this.available = this.available.filter((s) => s !== slot);
    // this.booked.push(slot);
  };

  markAsAvailable = (slotId: string): void => {
  };

  getSlotsAvailableOn = (date: Date): AvailableSlot[] =>
    this.available.filter(
      (s) => s.startTime.toDateString() === date.toDateString()
    );
}
