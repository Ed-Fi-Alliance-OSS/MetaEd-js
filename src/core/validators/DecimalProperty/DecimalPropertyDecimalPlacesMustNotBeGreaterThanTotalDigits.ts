import { ValidationRuleBase } from "../ValidationRuleBase";
export class DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits extends ValidationRuleBase<MetaEdGrammar.DecimalPropertyContext>
{
    public isValid(context: MetaEdGrammar.DecimalPropertyContext): boolean {
        var decimalPlaces = context.decimalPlaces().DecimalPlaces();
        var totalDigits = context.totalDigits().TotalDigits();
        return Number(decimalPlaces) <= Number(totalDigits);
    }
    public getFailureMessage(context: MetaEdGrammar.DecimalPropertyContext): string {
        return `Decimal Property '${context.propertyName().GetText()}' in ${context.ParentTypeName()} '${context.ParentIdentifier()}' has decimal places greater than total digits.`;
    }
}
