import { Command } from './command';
import { CommandHandler } from './commandHandler';

export const MapHandler = <T extends Command>(
  canHandle: (command: Command) => command is T,
  handler: CommandHandler<T>
): Handler => {
  return {
    canHandle,
    handle: (command) => handler.handle(<T>command),
  };
};

type CanHandle = (command: Command) => boolean;
type Handle = (command: Command) => Promise<void>;

export type Handler = {
  canHandle: CanHandle;
  handle: Handle;
};

export class CommandHandlerMap {
  private handlers: Handler[];

  constructor(...commandHandlers: Handler[]) {
    this.handlers = commandHandlers;
  }

  get = (command: Command): Handle | undefined =>
    this.handlers.find((h) => h.canHandle(command))?.handle;
}
