import { v4 as uuid } from 'uuid';
import { AvailableSlotsProjection } from '../../../src/application';
import { AvailableSlot } from '../../../src/domain/readModel/availableSlots';
import {
  SlotEvent,
  SlotEventType,
} from '../../../src/domain/writeModel/events';
import { InMemoryAvailableSlotsRepository } from '../../../src/infrastructure/inMemory';
import { Given, ProjectionTest } from '../../eventsourcing/projectionTest';

describe('Available Slots Projection', () => {
  const tenMinutes = '00:10:00';
  const now = new Date();
  const slotId = now.toISOString();
  const reason = 'No longer needed';

  let repository: InMemoryAvailableSlotsRepository;
  let given: ProjectionTest<SlotEvent, AvailableSlot>;

  beforeEach(async () => {
    repository = new InMemoryAvailableSlotsRepository();
    given = Given(new AvailableSlotsProjection(repository));
  });

  it('should be scheduled', () => {
    given({
      type: SlotEventType.Scheduled,
      data: {
        slotId,
        startTime: now.toISOString(),
        duration: tenMinutes,
      },
    }).then(
      [
        {
          slotId,
          startTime: now,
          duration: tenMinutes,
        },
      ],
      repository.getSlotsAvailableOn(now)
    );
  });

  // it('should remove slot from the list if it was booked', () => {
  //   given(
  //     {
  //       type: SlotEventType.Scheduled,
  //       data: {
  //         slotId,
  //         startTime: now.toISOString(),
  //         duration: tenMinutes,
  //       },
  //     },
  //     {
  //       type: SlotEventType.Booked,
  //       data: {
  //         slotId,
  //         patientId: uuid(),
  //       },
  //     }
  //   ).then([], repository.getSlotsAvailableOn(now));
  // });
  //
  // it('should add slot again if booking was cancelled', () => {
  //   given(
  //     {
  //       type: SlotEventType.Scheduled,
  //       data: {
  //         slotId,
  //         startTime: now.toISOString(),
  //         duration: tenMinutes,
  //       },
  //     },
  //     {
  //       type: SlotEventType.Booked,
  //       data: {
  //         slotId,
  //         patientId: uuid(),
  //       },
  //     },
  //     {
  //       type: SlotEventType.Cancelled,
  //       data: {
  //         slotId,
  //         reason,
  //       },
  //     }
  //   ).then(
  //     [
  //       {
  //         slotId,
  //         startTime: now,
  //         duration: tenMinutes,
  //       },
  //     ],
  //     repository.getSlotsAvailableOn(now)
  //   );
  // });
});
