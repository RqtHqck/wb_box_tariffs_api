export type TError = {
    code: string;
    text: string;
    data?: Record<string, any>;
}

export type TErrorData = Record<string, any>;

export class BaseError extends Error {
    code: string;
    text: string;
    data: TErrorData;
    statusCode: number;

    constructor(message: string, errorsData: TErrorData) {
        super(message);

        this.code = errorsData.code;
        this.text = errorsData.text;
        this.data = errorsData.data || {};
        this.statusCode = 500;
    }

    toJson(): string {
        return JSON.stringify({
            code: this.code,
            text: this.text,
            data: this.data,
        });
    }

    toObject(): TError {
        return {
            code: this.code,
            text: this.text,
            data: this.data,
        };
    }
}
