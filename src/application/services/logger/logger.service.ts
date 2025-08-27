import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
    constructor(context: string = 'LoggerService') {
        super(context);
    }

    static forContext(context: string): LoggerService {
        return new LoggerService(context);
    }

    override log(message: string) {
        super.log(message);
    }

    override error(message: string, trace?: string) {
        super.error(message, trace);
    }

    override warn(message: string) {
        super.warn(message);
    }

    override debug(message: string) {
        super.debug(message);
    }

    override verbose(message: string) {
        super.verbose(message);
    }
}