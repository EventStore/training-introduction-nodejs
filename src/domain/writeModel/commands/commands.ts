import { Command } from 'src/infrastructure/commands/command';

export type Book = Command<
  'book',
  {
    id: string;
    patientId: string;
  }
>;

export type Cancel = Command<
  'cancel',
  {
    id: string;
    reason: string;
    cancellationTime: Date;
  }
>;

export type Schedule = Command<
  'schedule',
  {
    id: string;
    startTime: Date;
    duration: string;
  }
>;

export type SlotCommand = Book | Cancel | Schedule;
