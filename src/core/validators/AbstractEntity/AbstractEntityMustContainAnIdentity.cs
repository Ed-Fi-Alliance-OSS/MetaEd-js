using System.Linq;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.AbstractEntity
{
    public class AbstractEntityMustContainAnIdentity : ValidationRuleBase<MetaEdGrammar.AbstractEntityContext>
    {
        public override bool IsValid(MetaEdGrammar.AbstractEntityContext context)
        {
            return context.property().Any(x => x.GetProperty().propertyComponents().propertyAnnotation().identity() != null);
        }

        public override string GetFailureMessage(MetaEdGrammar.AbstractEntityContext context)
        {
            return string.Format("Abstract Entity {0} does not have an identity specified.", context.abstractEntityName().ID().GetText());
        }
    }
}
