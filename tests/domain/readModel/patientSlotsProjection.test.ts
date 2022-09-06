import { PatientSlotsProjection } from '../../../src/application';
import {
  PatientSlot,
  PatientSlotStatus,
} from '../../../src/domain/readModel/patientSlots';
import {
  SlotEvent,
  SlotEventType,
} from '../../../src/domain/writeModel/events';
import { InMemoryPatientSlotsRepository } from '../../../src/infrastructure/inMemory';
import { Given, ProjectionTest } from '../../eventsourcing/projectionTest';

describe('Patient Slots Projection', () => {
  const tenMinutes = '00:10:00';
  const now = new Date();
  const slotId = now.toISOString();
  const patientId = 'patient-1234';
  const patient2Id = 'patient-5678';
  const reason = 'No longer needed';

  let repository: InMemoryPatientSlotsRepository;
  let given: ProjectionTest<SlotEvent, PatientSlot>;

  beforeEach(async () => {
    repository = new InMemoryPatientSlotsRepository();
    given = Given(new PatientSlotsProjection(repository));
  });

  it('should return an empty list of slots', () => {
    given().then([], repository.getPatientSlots(patientId));
  });

  it('should return an empty list of slots if the slot was scheduled', () => {
    given({
      type: SlotEventType.Scheduled,
      data: {
        slotId,
        startTime: now.toISOString(),
        duration: tenMinutes,
      },
    }).then([], repository.getPatientSlots(patientId));
  });

  it('should return a slot if was booked', () => {
  
  });

  it('should return a slot if was cancelled', () => {
   
  });

  it('should return both cancelled and booked', () => {

  });
});
