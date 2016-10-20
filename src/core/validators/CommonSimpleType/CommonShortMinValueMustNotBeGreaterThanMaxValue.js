import { ValidationRuleBase } from "../ValidationRuleBase";
export class CommonShortMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase<MetaEdGrammar.CommonShortContext>
{
    public isValid(context: MetaEdGrammar.CommonShortContext): boolean {
        if (context.minValue() == null || context.maxValue() == null)
            return true;
        let minValue = Number(context.minValue().MinValue());
        let maxValue = Number(context.maxValue().MaxValue());
        return minValue <= maxValue;
    }
    public getFailureMessage(context: MetaEdGrammar.CommonShortContext): string {
        return `Common Short '${context.commonShortName().getText()}' has min value greater than max value.`;
    }
}
