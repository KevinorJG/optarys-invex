import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CommandBus, ICommand } from '@nestjs/cqrs';
import { validateOrReject, ValidationError } from 'class-validator';

@Injectable()
export class MediatorService {
    private readonly logger = new Logger(MediatorService.name);

    constructor(private readonly commandBus: CommandBus) { }

    async execute<T extends ICommand, R = any>(command: T): Promise<R> {
        try {
            this.logger.log(`Validating command: ${command.constructor.name}`);
            await validateOrReject(command as object);

            this.logger.log(`Command ${command.constructor.name} passed validation`);
            return this.commandBus.execute(command); // delega al CommandBus real
        } catch (error) {
            this.logger.error(`Validation failed for command ${command.constructor.name}: ${error}`);

            if (Array.isArray(error) && error[0] instanceof ValidationError) {
                const messages = this.flattenErrors(error);

                throw new BadRequestException({
                    statusCode: 400,
                    error: "Bad Request",
                    message: "Validation failed",
                    details: messages
                });
            }

            // Si no es ValidationError, lanza normal
            throw error;
        }
    }

    /**
   * Convierte errores anidados de class-validator en un array plano
   */
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