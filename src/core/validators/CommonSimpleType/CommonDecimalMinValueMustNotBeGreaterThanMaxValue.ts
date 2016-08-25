import { ValidationRuleBase } from "../ValidationRuleBase";
export class CommonDecimalMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase<MetaEdGrammar.CommonDecimalContext>
{
    public isValid(context: MetaEdGrammar.CommonDecimalContext): boolean {
        if (context.minValueDecimal() == null || context.maxValueDecimal() == null)
            return true;
        var minValue = context.minValueDecimal().MinValue();
        var maxValue = context.maxValueDecimal().MaxValue();
        return Number(minValue) <= Number(maxValue);
    }
    public getFailureMessage(context: MetaEdGrammar.CommonDecimalContext): string {
        return `Common Decimal '${context.commonDecimalName().GetText()}' has min value greater than max value.`;
    }
}
