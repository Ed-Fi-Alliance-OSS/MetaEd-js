using System.Linq;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.DomainEntity
{
    public class DomainEntityMustContainAnIdentity : ValidationRuleBase<MetaEdGrammar.DomainEntityContext>
    {
        public override bool IsValid(MetaEdGrammar.DomainEntityContext context)
        {
            return context.property().Any(x => x.GetProperty().propertyComponents().propertyAnnotation().identity() != null);
        }

        public override string GetFailureMessage(MetaEdGrammar.DomainEntityContext context)
        {
            return string.Format("Domain Entity {0} does not have an identity specified.", context.entityName().ID().GetText());
        }
    }
}
