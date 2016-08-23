using System;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.CommonSimpleType
{
    public class CommonDecimalDecimalPlacesMustNotBeGreaterThanTotalDigits : ValidationRuleBase<MetaEdGrammar.CommonDecimalContext>
    {
        public override bool IsValid(MetaEdGrammar.CommonDecimalContext context)
        {
            // if there are convert exceptions, let it bomb out -- language parser should have handled
            var decimalPlaces = context.decimalPlaces().DecimalPlaces();
            var totalDigits = context.totalDigits().TotalDigits();

            return Convert.ToInt32(decimalPlaces) <= Convert.ToInt32(totalDigits);
        }

        public override string GetFailureMessage(MetaEdGrammar.CommonDecimalContext context)
        {
            return string.Format("Common Decimal '{0}' has decimal places greater than total digits.", context.commonDecimalName().GetText());
        }
    }
}
