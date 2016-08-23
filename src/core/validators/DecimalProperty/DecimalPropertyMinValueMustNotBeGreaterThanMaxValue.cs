using System;
using MetaEd.Grammar.Antlr;
using MetaEd.Grammar.Antlr.Extensions;

namespace MetaEd.Core.Validator.DecimalProperty
{
    public class DecimalPropertyMinValueMustNotBeGreaterThanMaxValue : ValidationRuleBase<MetaEdGrammar.DecimalPropertyContext>
    {
        public override bool IsValid(MetaEdGrammar.DecimalPropertyContext context)
        {
            if (context.minValueDecimal() == null || context.maxValueDecimal() == null) return true;
            
            // if there are convert exceptions, let it bomb out -- language parser should have handled
            var minValue = context.minValueDecimal().MinValue();
            var maxValue = context.maxValueDecimal().MaxValue();

            return Convert.ToDecimal(minValue) <= Convert.ToDecimal(maxValue);
        }

        public override string GetFailureMessage(MetaEdGrammar.DecimalPropertyContext context)
        {
            return string.Format("Decimal Property '{0}' in {1} '{2}' has min value greater than max value.",
                                 context.propertyName().GetText(), context.ParentTypeName(), context.ParentIdentifier());
        }
    }
}
