import { ValidationRuleBase } from "../ValidationRuleBase";
export class DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits extends ValidationRuleBase<MetaEdGrammar.DecimalPropertyContext>
{
    public isValid(context: MetaEdGrammar.DecimalPropertyContext): boolean {
        let decimalPlaces = context.decimalPlaces().DecimalPlaces();
        let totalDigits = context.totalDigits().TotalDigits();
        return Number(decimalPlaces) <= Number(totalDigits);
    }
    public getFailureMessage(context: MetaEdGrammar.DecimalPropertyContext): string {
        return `Decimal Property '${context.propertyName().getText()}' in ${context.ParentTypeName()} '${context.ParentIdentifier()}' has decimal places greater than total digits.`;
    }
}
