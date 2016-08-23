using System;
using MetaEd.Grammar.Antlr;
using MetaEd.Grammar.Antlr.Extensions;

namespace MetaEd.Core.Validator.StringProperty
{
    public class StringPropertyMinLengthMustNotBeGreaterThanMaxLength : ValidationRuleBase<MetaEdGrammar.StringPropertyContext>
    {
        public override bool IsValid(MetaEdGrammar.StringPropertyContext context)
        {
            // minLength is optional
            if (context.minLength() == null) return true;

            // if there are convert exceptions, let it bomb out -- language parser should have handled
            var minLength = Convert.ToInt32(context.minLength().MinLength());
            var maxLength = Convert.ToInt32(context.maxLength().MaxLength());

            return minLength <= maxLength;
        }

        public override string GetFailureMessage(MetaEdGrammar.StringPropertyContext context)
        {
            return string.Format("String Property '{0}' in {1} '{2}' has min length greater than max length.",
                                 context.propertyName().GetText(), context.ParentTypeName(), context.ParentIdentifier());
        }
    }
}
