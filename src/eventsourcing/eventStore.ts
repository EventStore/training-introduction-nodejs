import { Event } from './event';

export interface EventStore {
  appendEvents<StreamType extends Event = Event>(
    streamName: string,
    version: bigint | -1n,
    events: StreamType[]
  ): Promise<void>;

  loadEvents<StreamType extends Event = Event>(
    streamName: string
  ): Promise<StreamType[]>;
}
