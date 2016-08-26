import {ValidationLevel} from "./ValidationLevel";

export interface IValidationRule<TContext> {
    level(): ValidationLevel;
    isValid(context: TContext): boolean;
    getFailureMessage(context: TContext): string;
}