import { Result } from '@common/responses';
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { CommandBus, ICommand, Command } from '@nestjs/cqrs';
import { validateOrReject, ValidationError } from 'class-validator';

@Injectable()
export class MediatorService {
    private readonly logger = new Logger(MediatorService.name);

    constructor(private readonly commandBus: CommandBus) { }

    async execute<TCommand extends ICommand, TResult = TCommand extends Command<infer TR> ? TR : any>(command: TCommand): Promise<Result<TResult>> {
        try {
            this.logger.log(`Validating command: ${command.constructor.name}`);
            await validateOrReject(command as object);
            this.logger.log(`Command ${command.constructor.name} passed validation`);

            return await this.commandBus.execute(command);
        } catch (error) {
            this.logger.error(`Command ${command.constructor.name} failed: ${error}`);

            console.info(`es de tipo: `, error instanceof HttpException); // true o false
            if (Array.isArray(error) && error[0] instanceof ValidationError) {
                const messages = this.flattenErrors(error);
                return Result.failure('Validation failed', messages);
            }

            // Detectar HttpException de NestJS
            if (error instanceof HttpException) {
                const response = error.getResponse();
                const message = typeof response === 'string' ? response : (response as any).message;
                return Result.failure(message || error.message, response);
            }

            // Detecta si es una excepción HTTP de NestJS
            if (error.response) {
                return Result.failure(error.response.message || error.message, error.response);
            }

            return Result.failure(error.response || 'Unknown error');
        }
    }

    private flattenErrors(errors: ValidationError[], parentPath = ''): { property: string, message: string }[] {
        const result: { property: string, message: string }[] = [];

        for (const err of errors) {
            const path = parentPath ? `${parentPath}.${err.property}` : err.property;

            if (err.constraints) {
                for (const key of Object.keys(err.constraints)) {
                    result.push({
                        property: path,
                        message: err.constraints[key],
                    });
                }
            }

            if (err.children && err.children.length > 0) {
                result.push(...this.flattenErrors(err.children, path));
            }
        }

        return result;
    }
}