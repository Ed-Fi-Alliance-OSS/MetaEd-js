import { ValidationRuleBase } from "../ValidationRuleBase";
    export class CommonShortMinValueMustNotBeGreaterThanMaxValue extends ValidationRuleBase<MetaEdGrammar.CommonShortContext>
    {
        public isValid(context: MetaEdGrammar.CommonShortContext): boolean {
            if (context.minValue() == null || context.maxValue() == null)
                return true;
            var minValue = Convert.ToInt32(context.minValue().MinValue());
            var maxValue = Convert.ToInt32(context.maxValue().MaxValue());
            return minValue <= maxValue;
        }
        public getFailureMessage(context: MetaEdGrammar.CommonShortContext): string {
            return string.Format("Common Short '{0}' has min value greater than max value.", context.commonShortName().GetText());
        }
    }
