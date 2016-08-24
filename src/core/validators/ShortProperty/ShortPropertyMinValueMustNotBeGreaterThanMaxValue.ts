import { ValidationRuleBase } from "../ValidationRuleBase";
export class ShortPropertyMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase<MetaEdGrammar.ShortPropertyContext>
{
    public isValid(context: MetaEdGrammar.ShortPropertyContext): boolean {
        if (context.minValue() == null || context.maxValue() == null)
            return true;
        var minValue = Convert.ToInt32(context.minValue().MinValue());
        var maxValue = Convert.ToInt32(context.maxValue().MaxValue());
        return minValue <= maxValue;
    }
    public getFailureMessage(context: MetaEdGrammar.ShortPropertyContext): string {
        return string.Format("Short Property '{0}' in {1} '{2}' has min value greater than max value.",
            context.propertyName().GetText(), context.ParentTypeName(), context.ParentIdentifier());
    }
}
