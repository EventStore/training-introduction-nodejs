import {
  isSlotCommand,
  SlotCommand,
  SlotCommandType,
} from '../../../src/domain/writeModel/commands/commands';
import { Handlers } from '../../../src/domain/writeModel/commands/handlers';
import {
  Booked,
  Cancelled,
  SlotEvent,
  SlotEventType,
} from '../../../src/domain/writeModel/events/events';
import {
  SlotAggregate,
  SLOT_ALREADY_BOOKED,
  SLOT_ALREADY_SCHEDULED,
  SLOT_ALREADY_STARTED,
  SLOT_NOT_BOOKED,
  SLOT_NOT_SCHEDULED,
} from '../../../src/domain/writeModel/slotAggregate';
import {
  CommandHandlerMap,
  MapHandler,
} from '../../../src/infrastructure/commands/commandHandlerMap';
import { AggregateTest, Given } from '../../eventsourcing/aggregateTest';

describe('Slot Aggregate', () => {
  const tenMinutes = '00:10:00';
  const now = new Date();
  const oneHourAgo = (() => {
    const date = new Date();
    date.setHours(date.getHours() - 1);
    return date;
  })();
  const slotId = now.toISOString();
  const patientId = 'patient-1234';
  const reason = 'No longer needed';

  let given: AggregateTest<SlotAggregate, SlotEvent, SlotCommand>;

  beforeEach(async () => {
    given = Given(
      new SlotAggregate(),
      (store) =>
        new CommandHandlerMap(MapHandler(isSlotCommand, new Handlers(store)))
    );
  });

  it('should be scheduled', () =>
    given({
      type: SlotEventType.Scheduled,
      data: {
        slotId,
        startTime: now.toISOString(),
        duration: tenMinutes,
      },
    })
      .when({
        type: SlotCommandType.Schedule,
        data: {
          id: slotId,
          startTime: now,
          duration: tenMinutes,
        },
      })
      .thenThrows(SLOT_ALREADY_SCHEDULED));

  it('should be booked', () =>
    given({
      type: SlotEventType.Scheduled,
      data: {
        slotId,
        startTime: now.toISOString(),
        duration: tenMinutes,
      },
    })
      .when({
        type: SlotCommandType.Book,
        data: {
          id: slotId,
          patientId,
        },
      })
      .then((events) => {
        const booked: Booked = {
          type: SlotEventType.Booked,
          data: { slotId, patientId },
        };
        expect(events.at(-1)).toMatchObject(booked);
      }));

  it('should not be booked if was not scheduled', () =>
    given()
      .when({
        type: SlotCommandType.Book,
        data: {
          id: slotId,
          patientId,
        },
      })
      .thenThrows(SLOT_NOT_SCHEDULED));

  it('should not be double booked', () =>
    given(
      {
        type: SlotEventType.Scheduled,
        data: {
          slotId,
          startTime: now.toISOString(),
          duration: tenMinutes,
        },
      },
      {
        type: SlotEventType.Booked,
        data: {
          slotId,
          patientId,
        },
      }
    )
      .when({
        type: SlotCommandType.Book,
        data: {
          id: slotId,
          patientId,
        },
      })
      .thenThrows(SLOT_ALREADY_BOOKED));

  it('should be cancelled', () =>
    given(
      {
        type: SlotEventType.Scheduled,
        data: {
          slotId,
          startTime: now.toISOString(),
          duration: tenMinutes,
        },
      },
      {
        type: SlotEventType.Booked,
        data: {
          slotId,
          patientId,
        },
      }
    )
      .when({
        type: SlotCommandType.Cancel,
        data: {
          id: slotId,
          reason,
          cancellationTime: now,
        },
      })
      .then((events) => {
        const booked: Cancelled = {
          type: SlotEventType.Cancelled,
          data: { slotId, reason },
        };
        expect(events.at(-1)).toMatchObject(booked);
      }));

  it('should book again a cancelled slot', () =>
    given(
      {
        type: SlotEventType.Scheduled,
        data: {
          slotId,
          startTime: now.toISOString(),
          duration: tenMinutes,
        },
      },
      {
        type: SlotEventType.Booked,
        data: {
          slotId,
          patientId,
        },
      },
      {
        type: SlotEventType.Cancelled,
        data: { slotId, reason },
      }
    )
      .when({
        type: SlotCommandType.Book,
        data: {
          id: slotId,
          patientId,
        },
      })
      .then((events) => {
        const booked: Booked = {
          type: SlotEventType.Booked,
          data: { slotId, patientId },
        };
        expect(events.at(-1)).toMatchObject(booked);
      }));

  it('should not be cancelled after start time', () =>
    given(
      {
        type: SlotEventType.Scheduled,
        data: {
          slotId,
          startTime: oneHourAgo.toISOString(),
          duration: tenMinutes,
        },
      },
      {
        type: SlotEventType.Booked,
        data: {
          slotId,
          patientId,
        },
      }
    )
      .when({
        type: SlotCommandType.Cancel,
        data: {
          id: slotId,
          reason,
          cancellationTime: now,
        },
      })
      .thenThrows(SLOT_ALREADY_STARTED));

  it('should not be cancelled if was not booked', () =>
    given({
      type: SlotEventType.Scheduled,
      data: {
        slotId,
        startTime: (() => {
          now.setHours(now.getHours() - 1);
          return now.toISOString();
        })(),
        duration: tenMinutes,
      },
    })
      .when({
        type: SlotCommandType.Cancel,
        data: {
          id: slotId,
          reason,
          cancellationTime: now,
        },
      })
      .thenThrows(SLOT_NOT_BOOKED));
});
