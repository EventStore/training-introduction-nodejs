import { Command } from '../../../infrastructure/commands';

export enum SlotCommandType {
  Book = 'Book',
  Cancel = 'Cancel',
  Schedule = 'Schedule',
}

export type Book = Command<
  SlotCommandType.Book,
  {
    id: string;
    patientId: string;
  }
>;

export type Cancel = Command<
  SlotCommandType.Cancel,
  {
    id: string;
    reason: string;
    cancellationTime: Date;
  }
>;

export type Schedule = Command<
  SlotCommandType.Schedule,
  {
    id: string;
    startTime: Date;
    duration: string;
  }
>;

export type SlotCommand = Book | Cancel | Schedule;

export const isSlotCommand = (command: Command): command is SlotCommand =>
  Object.keys(SlotCommandType).includes(command.type);
