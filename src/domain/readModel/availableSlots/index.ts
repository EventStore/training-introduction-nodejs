export type AvailableSlot = {
  slotId: string;
  startTime: Date;
  duration: string;
};

export interface AvailableSlotsRepository {
  add(availableSlot: AvailableSlot): void;

  markAsBooked(slotId: string, patientId: string): void;

  markAsUnavailable(slotId: string): void;

  markAsAvailable(slotId: string): void;

  getSlotsAvailableOn(date: Date): AvailableSlot[];
}
