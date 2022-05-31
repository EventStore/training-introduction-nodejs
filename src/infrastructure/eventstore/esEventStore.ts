import {
  EventStoreDBClient,
  jsonEvent,
  NO_STREAM,
  StreamNotFoundError,
} from '@eventstore/db-client';
import { Event, EventStore } from '../../eventsourcing';

export class ESEventStore implements EventStore {
  constructor(private client: EventStoreDBClient) {}

  async appendEvents<StreamType extends Event = Event>(
    streamName: string,
    version: bigint | -1n,
    events: StreamType[]
  ): Promise<void> {
    if (events.length === 0) {
      return;
    }

    const preparedEvents = events.map(jsonEvent);

    await this.client.appendToStream(streamName, preparedEvents, {
      expectedRevision: version !== -1n ? version : NO_STREAM,
    });
  }

  async loadEvents<StreamType extends Event = Event>(
    streamName: string
  ): Promise<StreamType[]> {
    const readStream = this.client.readStream(streamName);
    const events: StreamType[] = [];

    try {
      for await (const { event } of readStream) {
        if (!event) continue;

        events.push(event as unknown as StreamType);
      }
    } catch (error) {
      if (error instanceof StreamNotFoundError) {
        return [];
      }

      throw error;
    }

    return events;
  }
}
