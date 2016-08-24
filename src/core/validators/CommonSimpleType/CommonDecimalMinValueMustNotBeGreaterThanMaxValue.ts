import { ValidationRuleBase } from "../ValidationRuleBase";
export class CommonDecimalMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase<MetaEdGrammar.CommonDecimalContext>
{
    public isValid(context: MetaEdGrammar.CommonDecimalContext): boolean {
        if (context.minValueDecimal() == null || context.maxValueDecimal() == null)
            return true;
        var minValue = context.minValueDecimal().MinValue();
        var maxValue = context.maxValueDecimal().MaxValue();
        return Convert.ToDecimal(minValue) <= Convert.ToDecimal(maxValue);
    }
    public getFailureMessage(context: MetaEdGrammar.CommonDecimalContext): string {
        return string.Format("Common Decimal '{0}' has min value greater than max value.", context.commonDecimalName().GetText());
    }
}
