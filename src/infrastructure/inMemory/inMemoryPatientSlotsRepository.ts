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
    const updated = this.available
      .filter((slot) => slot.slotId === slotId)
      .map((available) => {
        return {
          slotId: available.slotId,
          startTime: available.startTime,
          duration: available.duration,
          status: PatientSlotStatus.Booked,
        };
      })
      .at(0);

    if (!updated) return;

    const currentPatientSlots = this.patientSlots.get(patientId) ?? [];

    this.patientSlots.set(patientId, [...currentPatientSlots, updated]);
    this.available = this.available.filter((slot) => slot.slotId === slotId);
  };

  markAsCancelled = (slotId: string): void => {
    const allSlots = [...this.patientSlots.values()].reduce((prev, current) => [
      ...prev,
      ...current,
    ]);

    const slot = allSlots.find((slot) => slot.slotId == slotId);

    if (!slot) return;

    slot.status = PatientSlotStatus.Cancelled;

    this.available.push({
      slotId: slot.slotId,
      startTime: slot.startTime,
      duration: slot.duration,
    });
  };

  getPatientSlots = (patientId: string): PatientSlot[] =>
    this.patientSlots.get(patientId) ?? [];
}
