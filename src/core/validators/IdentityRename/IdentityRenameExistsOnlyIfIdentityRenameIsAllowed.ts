using System.Linq;
using MetaEd.Grammar.Antlr;
using MetaEd.Grammar.Antlr.Extensions;

namespace MetaEd.Core.Validator.IdentityRename
{
    public class IdentityRenameExistsOnlyIfIdentityRenameIsAllowed : ValidationRuleBase<MetaEdGrammar.IdentityRenameContext>
    {
        private readonly int[] _validIdentityRenameParentRuleIndices =
        {
            MetaEdGrammar.RULE_domainEntitySubclass,
            MetaEdGrammar.RULE_associationSubclass
        };

        public override bool IsValid(MetaEdGrammar.IdentityRenameContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return _validIdentityRenameParentRuleIndices.Contains(topLevelEntity.RuleIndex);
        }

        public override string GetFailureMessage(MetaEdGrammar.IdentityRenameContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            var propertyWithComponents = context.GetAncestorContext<IPropertyWithComponents>();

            return
                string.Format(
                    "'renames identity property' is invalid for property {0} on {1} '{2}'.  'renames identity property' is only valid for properties on types Domain Entity subclass and Association subclass.",
                    propertyWithComponents.IdNode().GetText(),
                    topLevelEntity.EntityIdentifier(),
                    topLevelEntity.EntityName());
        }
    }
}