using System.Linq;
using MetaEd.Grammar.Antlr;
using MetaEd.Grammar.Antlr.Extensions;

namespace MetaEd.Core.Validator.DomainEntity
{
    public class DomainEntityMustContainNoMoreThanOneUniqueIdColumn : ValidationRuleBase<MetaEdGrammar.DomainEntityContext>
    {
        public override bool IsValid(MetaEdGrammar.DomainEntityContext context)
        {
            var namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
            return namespaceInfo.IsExtension ||
                context.property().Count(x => x.GetProperty().PropertyName() == "UniqueId") <= 1;
        }

        public override string GetFailureMessage(MetaEdGrammar.DomainEntityContext context)
        {
            return string.Format("Domain Entity {0} has multiple properties with a property name of 'UniqueId'.  Only one column in a core domain entity can be named 'UniqueId'.", context.entityName().ID().GetText());
        }
    }
}
