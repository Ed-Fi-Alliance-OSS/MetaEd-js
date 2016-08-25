import { ValidationRuleBase } from "../ValidationRuleBase";
export class CommonIntegerMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase<MetaEdGrammar.CommonIntegerContext>
{
    public isValid(context: MetaEdGrammar.CommonIntegerContext): boolean {
        if (context.minValue() == null || context.maxValue() == null)
            return true;
        var minValue = Convert.ToInt32(context.minValue().MinValue());
        var maxValue = Convert.ToInt32(context.maxValue().MaxValue());
        return minValue <= maxValue;
    }
    public getFailureMessage(context: MetaEdGrammar.CommonIntegerContext): string {
        return `Common Integer '${context.commonIntegerName().GetText()}' has min value greater than max value.`;
    }
}
