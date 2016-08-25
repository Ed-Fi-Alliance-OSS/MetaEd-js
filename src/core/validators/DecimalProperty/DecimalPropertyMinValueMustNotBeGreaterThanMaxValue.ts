import { ValidationRuleBase } from "../ValidationRuleBase";
export class DecimalPropertyMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase<MetaEdGrammar.DecimalPropertyContext>
{
    public isValid(context: MetaEdGrammar.DecimalPropertyContext): boolean {
        if (context.minValueDecimal() == null || context.maxValueDecimal() == null)
            return true;
        var minValue = context.minValueDecimal().MinValue();
        var maxValue = context.maxValueDecimal().MaxValue();
        return Number(minValue) <= Number(maxValue);
    }
    public getFailureMessage(context: MetaEdGrammar.DecimalPropertyContext): string {
        return `Decimal Property '${context.propertyName().GetText()}' in ${context.ParentTypeName()} '${context.ParentIdentifier()}' has min value greater than max value.`
    }
}
