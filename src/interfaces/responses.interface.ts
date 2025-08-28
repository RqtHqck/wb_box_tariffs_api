import { TErrorData } from "#errors/BaseError.js";
import { ITariffBatch } from "./tariff.interface.js";

export type ErrorResponse = {
  status: number;
  body: {
    code: string;
    text: string;
    data?: TErrorData | unknown;
  };
};


export type IWbApiResponse = {
  response: {
    data: ITariffBatch
  }
}