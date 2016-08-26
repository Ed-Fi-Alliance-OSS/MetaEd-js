import { ValidationRuleBase } from "../ValidationRuleBase";
export class ShortPropertyMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase<MetaEdGrammar.ShortPropertyContext>
{
    public isValid(context: MetaEdGrammar.ShortPropertyContext): boolean {
        if (context.minValue() == null || context.maxValue() == null)
            return true;
        let minValue = Number(context.minValue().MinValue());
        let maxValue = Number(context.maxValue().MaxValue());
        return minValue <= maxValue;
    }
    public getFailureMessage(context: MetaEdGrammar.ShortPropertyContext): string {
        return `Short Property '${context.propertyName().GetText()}' in ${context.ParentTypeName()} '${context.ParentIdentifier()}' has min value greater than max value.`;
    }
}
