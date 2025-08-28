import { AuthClient } from "google-auth-library";
import { google, sheets_v4 } from "googleapis";

export class SheetsService {
  private sheets: sheets_v4.Sheets;

  constructor(private readonly client: AuthClient) {
    this.sheets = google.sheets({ version: "v4", auth: client as any });
  }

  async syncTariffs() {
    console.log('service sync');

    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: "xxxx",
      range: 'stocks_coefs!A2:G2'
    });

    const values = response.data.values; 
    console.log(values);


  }

  async _readGoogleSheet(sheetId: string, tabName: string, range: string) {
    const res = await this.sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${tabName}!${range}`,
    });

    return res.data.values;
  }

  async _writeGoogleSheet(
    sheetId: string,
    tabName: string,
    range: string,
    data: (string | number)[][],
  ): Promise<void> {
    await this.sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${tabName}!${range}`,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        majorDimension: "ROWS",
        values: data,
      },
    });
  }


}