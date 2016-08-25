import { ValidationRuleBase } from "../ValidationRuleBase";
export class CommonShortMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase<MetaEdGrammar.CommonShortContext>
{
    public isValid(context: MetaEdGrammar.CommonShortContext): boolean {
        if (context.minValue() == null || context.maxValue() == null)
            return true;
        var minValue = Number(context.minValue().MinValue());
        var maxValue = Number(context.maxValue().MaxValue());
        return minValue <= maxValue;
    }
    public getFailureMessage(context: MetaEdGrammar.CommonShortContext): string {
        return `Common Short '${context.commonShortName().GetText()}' has min value greater than max value.`;
    }
}
