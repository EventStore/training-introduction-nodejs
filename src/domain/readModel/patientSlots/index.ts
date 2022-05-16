export type AvailableSlot = {
  slotId: string;
  startTime: Date;
  duration: string;
};

export type PatientSlot = {
  slotId: string;
  startTime: Date;
  duration: string;
  status: string;
};

export interface PatientSlotsRepository {
  add(availableSlot: AvailableSlot): void;

  markAsBooked(slotId: string, patientId: string): void;

  markAsCancelled(slotId: string): void;

  getPatientSlots(patientId: string): PatientSlot[];
}
