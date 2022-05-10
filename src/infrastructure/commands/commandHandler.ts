import { Command } from './command';

export const NO_COMMAND_HANDLER_REGISTERED = 'NO_COMMAND_HANDLER_REGISTERED';

export interface CommandHandler<T extends Command> {
  handle: (command: T) => Promise<void>;
}
