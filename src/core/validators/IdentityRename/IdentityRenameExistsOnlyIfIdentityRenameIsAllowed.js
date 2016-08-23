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
            var IdentityRename;
            (function (IdentityRename) {
                class IdentityRenameExistsOnlyIfIdentityRenameIsAllowed {
                }
                ValidationRuleBase < MetaEdGrammar.IdentityRenameContext >
                    {
                        readonly: int[], _validIdentityRenameParentRuleIndices: _validIdentityRenameParentRuleIndices = {
                            MetaEdGrammar: .RULE_domainEntitySubclass,
                            MetaEdGrammar: .RULE_associationSubclass
                        },
                        override: bool, IsValid(MetaEdGrammar, IdentityRenameContext = context) {
                            var topLevelEntity = context.GetAncestorContext();
                            return _validIdentityRenameParentRuleIndices.Contains(topLevelEntity.RuleIndex);
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, IdentityRenameContext = context) {
                            var topLevelEntity = context.GetAncestorContext();
                            var propertyWithComponents = context.GetAncestorContext();
                            return;
                            string.Format("'renames identity property' is invalid for property {0} on {1} '{2}'.  'renames identity property' is only valid for properties on types Domain Entity subclass and Association subclass.", propertyWithComponents.IdNode().GetText(), topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName());
                        }
                    };
            })(IdentityRename = Validator.IdentityRename || (Validator.IdentityRename = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=IdentityRenameExistsOnlyIfIdentityRenameIsAllowed.js.map