import { AvailableSlot } from '../../domain/readModel/availableSlots';
import {
  PatientSlot,
  PatientSlotsRepository,
  PatientSlotStatus,
} from '../../domain/readModel/patientSlots';

export class InMemoryPatientSlotsRepository implements PatientSlotsRepository {
  private available: AvailableSlot[] = [];
  private patientSlots = new Map<string, PatientSlot[]>();

  add = (availableSlot: AvailableSlot): void => {
    this.available.push(availableSlot);
  };

  markAsBooked = (slotId: string, patientId: string): void => {
  };

  markAsCancelled = (slotId: string): void => {
  };

  getPatientSlots = (patientId: string): PatientSlot[] =>
    this.patientSlots.get(patientId) ?? [];
}
