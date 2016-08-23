using System;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.CommonSimpleType
{
    public class CommonIntegerMinValueMustNotBeGreaterThanMaxValue : ValidationRuleBase<MetaEdGrammar.CommonIntegerContext>
    {
        public override bool IsValid(MetaEdGrammar.CommonIntegerContext context)
        {
            if (context.minValue() == null || context.maxValue() == null) return true;
            
            // if there are convert exceptions, let it bomb out -- language parser should have handled
            var minValue = Convert.ToInt32(context.minValue().MinValue());
            var maxValue = Convert.ToInt32(context.maxValue().MaxValue());

            return minValue <= maxValue;
        }

        public override string GetFailureMessage(MetaEdGrammar.CommonIntegerContext context)
        {
            return string.Format("Common Integer '{0}' has min value greater than max value.", context.commonIntegerName().GetText());
        }
    }
}
