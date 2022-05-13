import {
  EventStoreDBClient,
  jsonEvent,
  NO_STREAM,
} from '@eventstore/db-client';
import { EventStore } from '../../eventsourcing/eventStore';

export class ESEventStore implements EventStore {
  constructor(private client: EventStoreDBClient) {}

  async appendEvents<StreamType>(
    streamName: string,
    version: bigint | -1,
    events: StreamType[]
  ): Promise<void> {
    if (events.length === 0) {
      return;
    }

    const preparedEvents = events.map((event) => jsonEvent(event as any));

    await this.client.appendToStream(streamName, preparedEvents, {
      expectedRevision: version !== -1 ? version : NO_STREAM,
    });
  }

  async loadEvents<StreamType>(streamName: string): Promise<StreamType[]> {
    const readStream = this.client.readStream(streamName);
    const events: StreamType[] = [];

    for await (const { event } of readStream) {
      if (!event) continue;

      events.push(event as unknown as StreamType);
    }

    return events;
  }
}
