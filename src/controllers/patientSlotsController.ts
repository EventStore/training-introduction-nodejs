import { NextFunction, Request, Response, Router } from 'express';
import { PatientSlotsRepository } from '../domain/readModel/patientSlots';

export const getPatientSlotsController = (
  repository: PatientSlotsRepository
) => {
  const router = Router();

  router.get(
    '/api/slots/patient/:patientId',
    async (request: Request, response: Response, next: NextFunction) => {
      try {
        response.send(repository.getPatientSlots(request.params.patientId));
      } catch (error) {
        console.error(`ERROR: ${error}`);
        next(error);
      }
    }
  );

  return router;
};
