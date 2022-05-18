import { NextFunction, Request, Response, Router } from 'express';
import { AvailableSlotsRepository } from '../domain/readModel/availableSlots';

export const getAvailableSlotsController = (
  repository: AvailableSlotsRepository
) => {
  const router = Router();

  router.get(
    '/api/slots/available/:date',
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        const date = new Date(request.params.date);

        response.send(repository.getSlotsAvailableOn(date));
      } catch (error) {
        console.error(`ERROR: ${error}`);
        next(error);
      }
    }
  );

  return router;
};
