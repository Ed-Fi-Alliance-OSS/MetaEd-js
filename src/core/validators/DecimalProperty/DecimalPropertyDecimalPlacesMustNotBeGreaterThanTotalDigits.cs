using System;
using MetaEd.Grammar.Antlr;
using MetaEd.Grammar.Antlr.Extensions;

namespace MetaEd.Core.Validator.DecimalProperty
{
    public class DecimalPropertyDecimalPlacesMustNotBeGreaterThanTotalDigits : ValidationRuleBase<MetaEdGrammar.DecimalPropertyContext>
    {
        public override bool IsValid(MetaEdGrammar.DecimalPropertyContext context)
        {
            // if there are convert exceptions, let it bomb out -- language parser should have handled
            var decimalPlaces = context.decimalPlaces().DecimalPlaces();
            var totalDigits = context.totalDigits().TotalDigits();

            return Convert.ToInt32(decimalPlaces) <= Convert.ToInt32(totalDigits);
        }

        public override string GetFailureMessage(MetaEdGrammar.DecimalPropertyContext context)
        {
            return string.Format("Decimal Property '{0}' in {1} '{2}' has decimal places greater than total digits.",
                                 context.propertyName().GetText(), context.ParentTypeName(), context.ParentIdentifier());
        }
    }
}
