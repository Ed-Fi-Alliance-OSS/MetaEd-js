using System;
using MetaEd.Grammar.Antlr;
using MetaEd.Grammar.Antlr.Extensions;

namespace MetaEd.Core.Validator.IntegerProperty
{
    public class IntegerPropertyMinValueMustNotBeGreaterThanMaxValue : ValidationRuleBase<MetaEdGrammar.IntegerPropertyContext>
    {
        public override bool IsValid(MetaEdGrammar.IntegerPropertyContext context)
        {
            if (context.minValue() == null || context.maxValue() == null) return true;
            
            // if there are convert exceptions, let it bomb out -- language parser should have handled
            var minValue = Convert.ToInt32(context.minValue().MinValue());
            var maxValue = Convert.ToInt32(context.maxValue().MaxValue());

            return minValue <= maxValue;
        }

        public override string GetFailureMessage(MetaEdGrammar.IntegerPropertyContext context)
        {
            return string.Format("Integer Property '{0}' in {1} '{2}' has min value greater than max value.",
                                 context.propertyName().GetText(), context.ParentTypeName(), context.ParentIdentifier());
        }
    }
}
