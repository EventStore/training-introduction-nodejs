import { Command } from './command';
import { NO_COMMAND_HANDLER_REGISTERED } from './commandHandler';
import { CommandHandlerMap } from './commandHandlerMap';

export class Dispatcher {
  constructor(private map: CommandHandlerMap) {}

  dispatch(command: Command): Promise<void> {
    const handler = this.map.get(command);

    if (!handler) {
      throw NO_COMMAND_HANDLER_REGISTERED;
    }

    return handler(command);
  }
}
