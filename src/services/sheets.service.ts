import env from "#config/env/env.js";
import NotFoundError from "#errors/NotFound.error.js";
import { getToday } from "#helpers/getToday.js";
import { dateToYyyyMmDdPipe, nullToDashPipe } from "#helpers/pipes.js";
import { IBoxTariff, ITariffBatch } from "#interfaces/tariff.interface.js";
import knex from "#postgres/knex.js";
import { TariffsRepository } from "#repositories/tariffs.repository.js";
import { handleError } from "#utils/errorHandler.js";
import { AuthClient } from "google-auth-library";
import { google, sheets_v4 } from "googleapis";
import { Knex } from "knex";

export class SheetsService {
  private sheets: sheets_v4.Sheets;
  private spreadsheetIds: string[] = env.GOOGLE_SPREADSHEET_IDS!.split(",");
  private spreadsheetTabName = env.GOOGLE_SPREADSHEET_TAB_NAME || "stocks_coefs";

  constructor(
    private readonly client: AuthClient,
    private readonly tariffsRepository: TariffsRepository
  ) {
    this.sheets = google.sheets({ version: "v4", auth: client as any });
  }

  async syncTariffs() {   
    await knex.transaction(async trx => {
      const todayDate = getToday();

      const tariffsBatch = await this.tariffsRepository.findBatchByDate(todayDate, trx);
      if (!tariffsBatch || !tariffsBatch.box_tariffs?.length) {
        handleError(new NotFoundError({
          code: "tariffs_not_found",
          text: `Tariffs by date ${todayDate} not found`,
        }));
      };
  
      // generate headers
      const headers = [
        "date",
        "dt_next_box",
        "dt_till_max",
        ...Object.keys(tariffsBatch.box_tariffs[0]).filter(key => !['id', 'batch_id', 'created_at', 'updated_at'].includes(key)),
      ];
      console.log(`Headers: ${headers}`)

      // create rows for insert to google spreadsheets
      let rows = tariffsBatch.box_tariffs.map((tariff: IBoxTariff) => [
        todayDate,
        dateToYyyyMmDdPipe(tariffsBatch.dt_next_box),
        dateToYyyyMmDdPipe(tariffsBatch.dt_till_max),
        nullToDashPipe(tariff.box_delivery_base),
        nullToDashPipe(tariff.box_delivery_coef_expr),
        nullToDashPipe(tariff.box_delivery_liter),
        nullToDashPipe(tariff.box_delivery_marketplace_base),
        nullToDashPipe(tariff.box_delivery_marketplace_coef_expr),
        nullToDashPipe(tariff.box_delivery_marketplace_liter),
        nullToDashPipe(tariff.box_storage_base),
        nullToDashPipe(tariff.box_storage_coef_expr),
        nullToDashPipe(tariff.box_storage_liter),
        tariff.geo_name,
        tariff.warehouse_name,
      ]);
      
      rows = this._sortGoogleSheetRows(rows, 7);
      
      console.log(`rows: ${JSON.stringify(rows)}`);

      console.log(`[SHEET] Process sync ${this.spreadsheetIds.length} google spreadsheets`);
  
      for (const spreadsheetId of this.spreadsheetIds) {
        console.log(`[SHEET] Process sync google spreadsheet with ID: ${spreadsheetId}`);
  
        await this._updateGoogleSheet(
          spreadsheetId,
          this.spreadsheetTabName,
          `A1:O${rows.length + 1}`,
          [headers, ...rows]
        );
      }
      
      console.log(`[SHEET] Tariffs are synced to [${this.spreadsheetIds.join(',')}] google spreadsheets sucessfully`);
    });
  }

  private async _updateGoogleSheet(
    sheetId: string,
    tabName: string,
    range: string,
    data: (any)[][],
  ): Promise<void> {
    await this.sheets.spreadsheets.values.update({
      spreadsheetId: sheetId, // table sheet id
      range: `${tabName}!${range}`, // range
      valueInputOption: "USER_ENTERED", // how data will be inserted in excel sheet (convert)
      requestBody: {
        majorDimension: "ROWS", // how data will be inserted
        values: data,
      },
    });
  }


private _sortGoogleSheetRows(rows: string[][], columnIndex = 0): string[][] {
  return rows.sort((a, b) => {
    const num1 = (a[columnIndex] === '-' || !a[columnIndex]) ? Infinity : parseInt(a[columnIndex], 10);
    const num2 = (b[columnIndex] === '-' || !b[columnIndex]) ? Infinity : parseInt(b[columnIndex], 10);
    return num1 - num2;
  });
}


}