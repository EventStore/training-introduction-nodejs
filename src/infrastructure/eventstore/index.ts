import { EventStoreDBClient } from '@eventstore/db-client';

const connectionString = 'esdb://localhost:2113?tls=false';

let eventStoreDBClient: EventStoreDBClient;

export function getEventStoreDBClient(): EventStoreDBClient {
  if (!eventStoreDBClient) {
    eventStoreDBClient = EventStoreDBClient.connectionString(connectionString);
  }

  return eventStoreDBClient;
}

export const disconnectFromEventStoreDB = async () => {
  const eventStore = getEventStoreDBClient();

  try {
    return await eventStore.dispose();
  } catch (ex) {
    console.error(ex);
  }
};
