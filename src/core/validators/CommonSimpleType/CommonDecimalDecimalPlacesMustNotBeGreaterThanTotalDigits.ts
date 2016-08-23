import {ValidationRuleBase} from "../ValidationRuleBase";

export class CommonDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits extends ValidationRuleBase<MetaEdGrammar.CommonDecimalContext>
{
    public isValid(context): boolean {
        let decimalPlaces = context.decimalPlaces().UNSIGNED_INT().getText();
        let totalDigits = context.totalDigits().UNSIGNED_INT().getText();
        return Number(decimalPlaces) <= Number(totalDigits);
    }
    public getFailureMessage(context): string {
        return `Common Decimal '${context.commonDecimalName().getText()} has decimal places greater than total digits.`;
    }
}