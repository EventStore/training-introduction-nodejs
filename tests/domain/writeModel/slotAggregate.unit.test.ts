import {
  isSlotCommand,
  SlotCommand,
  SlotCommandType,
} from '../../../src/domain/writeModel/commands/commands';
import { Handlers } from '../../../src/domain/writeModel/commands/handlers';
import { SlotEvent } from '../../../src/domain/writeModel/events/events';
import {
  SlotAggregate,
  SLOT_ALREADY_SCHEDULED,
} from '../../../src/domain/writeModel/slotAggregate';
import {
  CommandHandlerMap,
  MapHandler,
} from '../../../src/infrastructure/commands/commandHandlerMap';
import { AggregateTest, Given } from '../../eventsourcing/aggregateTest';

describe('EventStoreDBContainer', () => {
  const tenMinutes = '00:10:00';
  const now = new Date();
  const slotId = now.toString();
  let given: AggregateTest<SlotAggregate, SlotEvent, SlotCommand>;
  //const patientId = 'patient-1234';

  beforeEach(async () => {
    given = Given(
      new SlotAggregate(),
      (store) =>
        new CommandHandlerMap(MapHandler(isSlotCommand, new Handlers(store)))
    );
  });

  it('should be scheduled', () =>
    given({
      type: 'scheduled',
      data: {
        slotId,
        startTime: now,
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

  afterAll(async () => {
    console.log('test');
  });
});
