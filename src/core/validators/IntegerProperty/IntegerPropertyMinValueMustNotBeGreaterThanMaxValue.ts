import { ValidationRuleBase } from "../ValidationRuleBase";
export class IntegerPropertyMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase<MetaEdGrammar.IntegerPropertyContext>
{
    public isValid(context: MetaEdGrammar.IntegerPropertyContext): boolean {
        if (context.minValue() == null || context.maxValue() == null)
            return true;
        let minValue = Number(context.minValue().MinValue());
        let maxValue = Number(context.maxValue().MaxValue());
        return minValue <= maxValue;
    }
    public getFailureMessage(context: MetaEdGrammar.IntegerPropertyContext): string {
        return `Integer Property '${context.propertyName().GetText()}' in ${context.ParentTypeName()} '${context.ParentIdentifier()}' has min value greater than max value.`;
    }
}
