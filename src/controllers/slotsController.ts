import { NextFunction, Request, Response, Router } from 'express';
import {
  Book,
  Cancel,
  Schedule,
  SlotCommandType,
} from 'src/domain/writeModel/commands/commands';
import { Dispatcher } from 'src/infrastructure/commands/dispatcher';

export const getSlotsController = (dispatcher: Dispatcher) => {
  const router = Router();

  router.post(
    '/api/slots',
    async (request: PostSchedule, response: Response, next: NextFunction) => {
      try {
        const aggregateId = request.body.startDateTime;
        const command: Schedule = {
          type: SlotCommandType.Schedule,
          data: {
            id: aggregateId,
            duration: request.body.duration,
            startTime: new Date(request.body.startDateTime),
          },
        };

        await dispatcher.dispatch(command);

        response.setHeader('Location', `/api/slots/${aggregateId}`);
        response.sendStatus(201);
      } catch (error) {
        console.error(`ERROR: ${error}`);
        next(error);
      }
    }
  );

  router.post(
    '/api/slots/:aggregateId/book',
    async (request: PostBook, response: Response, next: NextFunction) => {
      try {
        const aggregateId = request.params.aggregateId;
        const command: Book = {
          type: SlotCommandType.Book,
          data: {
            id: aggregateId,
            patientId: request.body.patientId,
          },
        };

        await dispatcher.dispatch(command);

        response.setHeader('Location', `/api/slots/${aggregateId}`);
        response.sendStatus(200);
      } catch (error) {
        console.error(`ERROR: ${error}`);
        next(error);
      }
    }
  );

  router.post(
    '/api/slots/:aggregateId/cancel',
    async (request: PostCancel, response: Response, next: NextFunction) => {
      try {
        const aggregateId = request.params.aggregateId;
        const command: Cancel = {
          type: SlotCommandType.Cancel,
          data: {
            id: aggregateId,
            reason: request.body.reason,
            cancellationTime: new Date(),
          },
        };

        await dispatcher.dispatch(command);

        response.setHeader('Location', `/api/slots/${aggregateId}`);
        response.sendStatus(200);
      } catch (error) {
        console.error(`ERROR: ${error}`);
        next(error);
      }
    }
  );

  return router;
};

export type PostSchedule = Request<
  never,
  never,
  {
    startDateTime: string;
    duration: string;
  }
>;

export type PostBook = Request<
  { aggregateId: string },
  never,
  {
    patientId: string;
  }
>;

export type PostCancel = Request<
  { aggregateId: string },
  never,
  {
    reason: string;
  }
>;
