import { ValidationRuleBase } from "../ValidationRuleBase";
    export class DecimalPropertyMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase<MetaEdGrammar.DecimalPropertyContext>
    {
        public isValid(context: MetaEdGrammar.DecimalPropertyContext): boolean {
            if (context.minValueDecimal() == null || context.maxValueDecimal() == null)
                return true;
            var minValue = context.minValueDecimal().MinValue();
            var maxValue = context.maxValueDecimal().MaxValue();
            return Convert.ToDecimal(minValue) <= Convert.ToDecimal(maxValue);
        }
        public getFailureMessage(context: MetaEdGrammar.DecimalPropertyContext): string {
            return string.Format("Decimal Property '{0}' in {1} '{2}' has min value greater than max value.",
                context.propertyName().GetText(), context.ParentTypeName(), context.ParentIdentifier());
        }
    }
}