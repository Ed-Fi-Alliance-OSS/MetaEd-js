using System;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.CommonSimpleType
{
    public class CommonDecimalMinValueMustNotBeGreaterThanMaxValue : ValidationRuleBase<MetaEdGrammar.CommonDecimalContext>
    {
        public override bool IsValid(MetaEdGrammar.CommonDecimalContext context)
        {
            if (context.minValueDecimal() == null || context.maxValueDecimal() == null) return true;
            
            // if there are convert exceptions, let it bomb out -- language parser should have handled
            var minValue = context.minValueDecimal().MinValue();
            var maxValue = context.maxValueDecimal().MaxValue();

            return Convert.ToDecimal(minValue) <= Convert.ToDecimal(maxValue);
        }

        public override string GetFailureMessage(MetaEdGrammar.CommonDecimalContext context)
        {
            return string.Format("Common Decimal '{0}' has min value greater than max value.", context.commonDecimalName().GetText());
        }
    }
}
