using System.Linq;
using MetaEd.Grammar.Antlr;
using MetaEd.Grammar.Antlr.Extensions;

namespace MetaEd.Core.Validator.Identity
{
    public class IdentityExistsOnlyIfIdentityIsAllowed : ValidationRuleBase<MetaEdGrammar.IdentityContext>
    {
        private readonly int[] _validIdentityRuleIndices =
        {
            MetaEdGrammar.RULE_abstractEntity,
            MetaEdGrammar.RULE_association,
            MetaEdGrammar.RULE_commonType,
            MetaEdGrammar.RULE_domainEntity,
            MetaEdGrammar.RULE_inlineCommonType
        };

        private readonly string[] _validIdentityTokenNames =
        {
            MetaEdGrammar.TokenName(MetaEdGrammar.ABSTRACT_ENTITY),
            MetaEdGrammar.TokenName(MetaEdGrammar.ASSOCIATION),
            MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_TYPE),
            MetaEdGrammar.TokenName(MetaEdGrammar.DOMAIN_ENTITY),
            MetaEdGrammar.TokenName(MetaEdGrammar.INLINE_COMMON_TYPE),
        };

        public override bool IsValid(MetaEdGrammar.IdentityContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return _validIdentityRuleIndices.Contains(topLevelEntity.RuleIndex);
        }

        public override string GetFailureMessage(MetaEdGrammar.IdentityContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            var propertyWithComponents = context.GetAncestorContext<IPropertyWithComponents>();
            var validNames = string.Join(", ", _validIdentityTokenNames);
            return
                string.Format(
                    "'is part of identity' is invalid for property {0} on {1} '{2}'.  'is part of identity' is only valid for properties on types: {3}.",
                    propertyWithComponents.IdNode().GetText(),
                    topLevelEntity.EntityIdentifier(),
                    topLevelEntity.EntityName(),
                    validNames);
        }
    }
}