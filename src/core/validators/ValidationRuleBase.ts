import {ValidationLevel} from "./ValidationLevel";
import {IValidationRule} from "./IValidationRule";

export abstract class ValidationRuleBase implements IValidationRule
{
    public level() : ValidationLevel {
        return ValidationLevel.Error;
    }

    public abstract isValid(context) : boolean;
    public abstract getFailureMessage(context) : string;
}