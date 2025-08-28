import { TariffsService } from "#services/tariffs.service.js";
import cron from "node-cron";
import { handleError } from "./errorHandler.js";
import CronError from "#errors/Cron.error.js";

const tariffsService = new TariffsService()

export const sheduleCrone = async () => {
  try {
    cron.schedule('*/20 * * * * *', async () => {
        console.log('Running task...');
        
        await tariffsService.syncTariffs()
      });
  } catch (err) {
    handleError(new CronError({
      code: 'cron_error',
      text: 'Cron error',
      data: err as Error
    }));
  }
}

