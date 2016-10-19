"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class IdentityRenameExistsOnlyIfIdentityRenameIsAllowed extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(...args) {
        super(...args);
        this._validIdentityRenameParentRuleIndices = [MetaEdGrammar.RULE_domainEntitySubclass,
            MetaEdGrammar.RULE_associationSubclass];
    }
    isValid(context) {
        let topLevelEntity = context.GetAncestorContext();
        return this._validIdentityRenameParentRuleIndices.Contains(topLevelEntity.RuleIndex);
    }
    getFailureMessage(context) {
        let topLevelEntity = context.GetAncestorContext();
        let propertyWithComponents = context.GetAncestorContext();
        return `'renames identity property' is invalid for property ${propertyWithComponents.IdNode().GetText()} on ${topLevelEntity.EntityIdentifier()} '${topLevelEntity.EntityName()}'.  'renames identity property' is only valid for properties on types Domain Entity subclass and Association subclass.`;
    }
}
exports.IdentityRenameExistsOnlyIfIdentityRenameIsAllowed = IdentityRenameExistsOnlyIfIdentityRenameIsAllowed;
//# sourceMappingURL=IdentityRenameExistsOnlyIfIdentityRenameIsAllowed.js.map