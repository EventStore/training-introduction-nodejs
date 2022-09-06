import express, { Application } from 'express';
import http from 'http';
import { AvailableSlotsProjection } from './application/availableSlotsProjection';
import { PatientSlotsProjection } from './application/patientSlotsProjection';
import { getAvailableSlotsController } from './controllers/availableSlotsController';
import { getPatientSlotsController } from './controllers/patientSlotsController';
import { getSlotsController } from './controllers/slotsController';
import { isSlotCommand } from './domain/writeModel/commands/commands';
import { Handlers } from './domain/writeModel/commands/handlers';
import { SlotEvent } from './domain/writeModel/events';
import { SlotAggregate } from './domain/writeModel/slotAggregate';
import {
  CommandHandlerMap,
  MapHandler,
} from './infrastructure/commands/commandHandlerMap';
import { Dispatcher } from './infrastructure/commands/dispatcher';
import {
  disconnectFromEventStoreDB,
  getEventStoreDBClient,
} from './infrastructure/eventstore';
import { ESAggregateStore } from './infrastructure/eventstore/esAggregateStore';
import { ESEventStore } from './infrastructure/eventstore/esEventStore';
import { InMemoryAvailableSlotsRepository } from './infrastructure/inMemory/inMemoryAvailableSlotsRepository';
import { InMemoryPatientSlotsRepository } from './infrastructure/inMemory/inMemoryPatientSlotsRepository';
import { DbProjector } from './infrastructure/projections/dbProjector';
import { SubscriptionManager } from './infrastructure/projections/subscriptionManager';

const eventStoreDBClient = getEventStoreDBClient();
process.once('SIGTERM', disconnectFromEventStoreDB);

// Write model
const eventStore = new ESEventStore(eventStoreDBClient);
const aggregateStore = new ESAggregateStore<SlotAggregate, SlotEvent>(
  eventStore,
  SlotAggregate.type,
  () => new SlotAggregate()
);
const slotCommandHandler = new Handlers(aggregateStore);
const dispatcher = new Dispatcher(
  new CommandHandlerMap(MapHandler(isSlotCommand, slotCommandHandler))
);
const slotsController = getSlotsController(dispatcher);

// Read models
const availableSlotsRepository = new InMemoryAvailableSlotsRepository();
const availableSlotsProjection = new AvailableSlotsProjection(
  availableSlotsRepository
);
const availableSlotsController = getAvailableSlotsController(
  availableSlotsRepository
);

const patientSlotsRepository = new InMemoryPatientSlotsRepository();
const patientSlotsProjection = new PatientSlotsProjection(
  patientSlotsRepository
);
const patientSlotsController = getPatientSlotsController(
  patientSlotsRepository
);

// API setup
const port = 3000;
const app: Application = express();

app.set('etag', false);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(slotsController);
app.use(availableSlotsController);
app.use(patientSlotsController);

const server = http.createServer(app);

server.listen(port);

server.on('listening', () => {
  console.info('server up listening');
});

// Subscriptions setup
const subscription = new SubscriptionManager(
  eventStoreDBClient,
  new DbProjector(availableSlotsProjection),
  new DbProjector(patientSlotsProjection)
);
subscription.start();
