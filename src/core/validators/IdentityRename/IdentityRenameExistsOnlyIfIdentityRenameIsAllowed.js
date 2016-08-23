var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var IdentityRename;
            (function (IdentityRename) {
                class IdentityRenameExistsOnlyIfIdentityRenameIsAllowed extends ValidationRuleBase {
                    constructor(...args) {
                        super(...args);
                        this._validIdentityRenameParentRuleIndices = [MetaEdGrammar.RULE_domainEntitySubclass,
                            MetaEdGrammar.RULE_associationSubclass];
                    }
                    isValid(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        return this._validIdentityRenameParentRuleIndices.Contains(topLevelEntity.RuleIndex);
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        var propertyWithComponents = context.GetAncestorContext();
                        return string.Format("'renames identity property' is invalid for property {0} on {1} '{2}'.  'renames identity property' is only valid for properties on types Domain Entity subclass and Association subclass.", propertyWithComponents.IdNode().GetText(), topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName());
                    }
                }
                IdentityRename.IdentityRenameExistsOnlyIfIdentityRenameIsAllowed = IdentityRenameExistsOnlyIfIdentityRenameIsAllowed;
            })(IdentityRename = Validator.IdentityRename || (Validator.IdentityRename = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=IdentityRenameExistsOnlyIfIdentityRenameIsAllowed.js.map