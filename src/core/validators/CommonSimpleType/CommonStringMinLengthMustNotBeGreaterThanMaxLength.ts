using System;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.CommonSimpleType
{
    public class CommonStringMinLengthMustNotBeGreaterThanMaxLength : ValidationRuleBase<MetaEdGrammar.CommonStringContext>
    {
        public override bool IsValid(MetaEdGrammar.CommonStringContext context)
        {
            // minLength is optional
            if (context.minLength() == null) return true;

            // if there are convert exceptions, let it bomb out -- language parser should have handled
            var minLength = Convert.ToInt32(context.minLength().MinLength());
            var maxLength = Convert.ToInt32(context.maxLength().MaxLength());

            return minLength <= maxLength;
        }

        public override string GetFailureMessage(MetaEdGrammar.CommonStringContext context)
        {
            return string.Format("Common String '{0}' has min length greater than max length.", context.commonStringName().GetText());
        }
    }
}
