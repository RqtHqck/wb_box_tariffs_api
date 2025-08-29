import { TariffsService } from "#services/tariffs.service.js";
import cron from "node-cron";
import { handleError } from "./errorHandler.js";
import CronError from "#errors/Cron.error.js";
import { SheetsService } from "#services/sheets.service.js";
import client from "./googleapi.js";
import { TariffsRepository } from "#repository/tariffs.repository.js";
import knex from "#postgres/knex.js";

const tariffsRepository = new TariffsRepository(knex);
const tariffsService = new TariffsService(tariffsRepository)
const sheetsService = new SheetsService(client as any, tariffsRepository);

export const sheduleCrone = async () => {
  try {
    cron.schedule('*/20 * * * * *', async () => {
        console.log('Sync tariffs...');
        
        await tariffsService.syncTariffs();
        await sheetsService.syncTariffs();
      });
  } catch (err) {
    handleError(new CronError({
      code: 'cron_error',
      text: 'Cron error',
      data: err as Error
    }));
  }
}

