import { Command, ICommand } from "@nestjs/cqrs";
import { Result } from "../responses/result";

export type ICommandHandler<TCommand extends ICommand = any, TResult = any> =
    TCommand extends Command<infer InferredCommandResult>
    ? {
        execute(command: TCommand): Promise<Result<InferredCommandResult>>;
    }
    : {
        execute(command: TCommand): Promise<Result<TResult>>;
    };

