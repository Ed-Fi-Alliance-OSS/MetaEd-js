import {ValidationLevel} from "./ValidationLevel";

export interface IValidationRule {
    level() : ValidationLevel;
    isValid(context) : boolean;
    getFailureMessage(context) : string;
}