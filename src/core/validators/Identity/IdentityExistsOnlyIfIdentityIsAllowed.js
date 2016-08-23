using;
System.Linq;
using;
MetaEd.Grammar.Antlr;
using;
MetaEd.Grammar.Antlr.Extensions;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var Identity;
            (function (Identity) {
                class IdentityExistsOnlyIfIdentityIsAllowed {
                }
                ValidationRuleBase < MetaEdGrammar.IdentityContext >
                    {
                        readonly: int[], _validIdentityRuleIndices: _validIdentityRuleIndices = {
                            MetaEdGrammar: .RULE_abstractEntity,
                            MetaEdGrammar: .RULE_association,
                            MetaEdGrammar: .RULE_commonType,
                            MetaEdGrammar: .RULE_domainEntity,
                            MetaEdGrammar: .RULE_inlineCommonType
                        },
                        readonly: string[], _validIdentityTokenNames: _validIdentityTokenNames = {
                            MetaEdGrammar: .TokenName(MetaEdGrammar.ABSTRACT_ENTITY),
                            MetaEdGrammar: .TokenName(MetaEdGrammar.ASSOCIATION),
                            MetaEdGrammar: .TokenName(MetaEdGrammar.COMMON_TYPE),
                            MetaEdGrammar: .TokenName(MetaEdGrammar.DOMAIN_ENTITY),
                            MetaEdGrammar: .TokenName(MetaEdGrammar.INLINE_COMMON_TYPE),
                        },
                        override: bool, IsValid(MetaEdGrammar, IdentityContext = context) {
                            var topLevelEntity = context.GetAncestorContext();
                            return _validIdentityRuleIndices.Contains(topLevelEntity.RuleIndex);
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, IdentityContext = context) {
                            var topLevelEntity = context.GetAncestorContext();
                            var propertyWithComponents = context.GetAncestorContext();
                            var validNames = string.Join(", ", _validIdentityTokenNames);
                            return;
                            string.Format("'is part of identity' is invalid for property {0} on {1} '{2}'.  'is part of identity' is only valid for properties on types: {3}.", propertyWithComponents.IdNode().GetText(), topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName(), validNames);
                        }
                    };
            })(Identity = Validator.Identity || (Validator.Identity = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=IdentityExistsOnlyIfIdentityIsAllowed.js.map