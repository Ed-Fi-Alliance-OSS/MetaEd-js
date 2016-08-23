using MetaEd.Grammar.Antlr;
using MetaEd.Grammar.Antlr.Extensions;

namespace MetaEd.Core.Validator.IncludeProperty
{
    public class IncludePropertyMustNotContainIdentity : ValidationRuleBase<MetaEdGrammar.IncludePropertyContext>
    {
        public override bool IsValid(MetaEdGrammar.IncludePropertyContext context)
        {
            return context.propertyComponents().propertyAnnotation().identity() == null;
        }

        public override string GetFailureMessage(MetaEdGrammar.IncludePropertyContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return string.Format("Include property '{0}' is invalid to be used for the identity of {1} '{2}'", context.propertyName().GetText(), topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName());
        }
    }
}