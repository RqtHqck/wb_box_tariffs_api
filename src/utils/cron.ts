import { TariffsService } from "#services/tariffs.service.js";
import cron from "node-cron";
import { handleError } from "./errorHandler.js";
import CronError from "#errors/Cron.error.js";
import { SheetsService } from "#services/sheets.service.js";
import client from "./googleapi.js";
import { TariffsRepository } from "#repositories/tariffs.repository.js";
import knex from "#postgres/knex.js";
import { retry } from "#helpers/retry.js";
import { ServiceError } from "#errors/Service.error.js";
import { BaseError } from "#errors/BaseError.js";

const tariffsRepository = new TariffsRepository(knex);
const tariffsService = new TariffsService(tariffsRepository)
const sheetsService = new SheetsService(client as any, tariffsRepository);

let isRunning = false;

export const sheduleCrone = async () => {
  try {
    cron.schedule('*/20 * * * * *', async () => {

      if (isRunning) {
        console.log('Previous sync is still running, skipping...');
        return;
      }

      isRunning = true;
      console.log('Sync tariffs...');

      try {
        await retry(async () => {
          await tariffsService.syncTariffs();
        }, 5, 2500);
      } catch (err) {
        console.error('Failed to sync tariffs after retries, using existing data\nError: ', err);
      }

      try {
        await sheetsService.syncTariffs();
        console.log('Sync completed');
      } catch (err) {
        throw err;
      } finally {
        isRunning = false;
      }
    })
  } catch (err) {
    isRunning = false;
    if (err instanceof BaseError) {
      handleError(err);
    } else {
      handleError(new CronError({
        code: 'cron_error',
        text: 'Cron error',
        data: err as Error
      }));
    }
  }
}

