import { Command } from "@nestjs/cqrs";
import { Result } from "../responses/result";

export class ICommand<T> extends Command<Result<T>>{

}