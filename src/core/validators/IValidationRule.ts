import {ValidationLevel} from "./ValidationLevel";

export interface IValidationRule {
    level(): ValidationLevel;
    isValid(context: any) : boolean;
    getFailureMessage(context: any) : string;
}