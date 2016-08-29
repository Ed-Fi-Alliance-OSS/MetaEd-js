import {ValidationRuleBase} from "../ValidationRuleBase";

var MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;

export class CommonDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits extends ValidationRuleBase
{
    public handlesContext(context) : boolean {
        return context.ruleIndex === MetaEdGrammar.RULE_commonDecimal;
    }

    public isValid(context): boolean {
        let decimalPlaces = context.decimalPlaces().UNSIGNED_INT().getText();
        let totalDigits = context.totalDigits().UNSIGNED_INT().getText();
        return Number(decimalPlaces) <= Number(totalDigits);
    }

    public getFailureMessage(context): string {
        return `Common Decimal '${context.commonDecimalName().getText()} has decimal places greater than total digits.`;
    }
}