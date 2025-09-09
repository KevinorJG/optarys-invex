import { HttpStatus } from "@nestjs/common";

export interface ResponseBase {
    statusCode: HttpStatus,
    error: string,
    message: string,
    details?: any | undefined
}