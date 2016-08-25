"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class IdentityExistsOnlyIfIdentityIsAllowed extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(...args) {
        super(...args);
        this._validIdentityRuleIndices = [MetaEdGrammar.RULE_abstractEntity,
            MetaEdGrammar.RULE_association,
            MetaEdGrammar.RULE_commonType,
            MetaEdGrammar.RULE_domainEntity,
            MetaEdGrammar.RULE_inlineCommonType];
        this._validIdentityTokenNames = [MetaEdGrammar.TokenName(MetaEdGrammar.ABSTRACT_ENTITY),
            MetaEdGrammar.TokenName(MetaEdGrammar.ASSOCIATION),
            MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_TYPE),
            MetaEdGrammar.TokenName(MetaEdGrammar.DOMAIN_ENTITY),
            MetaEdGrammar.TokenName(MetaEdGrammar.INLINE_COMMON_TYPE)];
    }
    isValid(context) {
        var topLevelEntity = context.GetAncestorContext();
        return this._validIdentityRuleIndices.Contains(topLevelEntity.RuleIndex);
    }
    getFailureMessage(context) {
        var topLevelEntity = context.GetAncestorContext();
        var propertyWithComponents = context.GetAncestorContext();
        var validNames = this._validIdentityTokenNames.join(", ");
        return `'is part of identity' is invalid for property ${propertyWithComponents.IdNode().GetText()} on ${topLevelEntity.EntityIdentifier()} '${topLevelEntity.EntityName()}'.  'is part of identity' is only valid for properties on types: ${validNames}.`;
    }
}
exports.IdentityExistsOnlyIfIdentityIsAllowed = IdentityExistsOnlyIfIdentityIsAllowed;
//# sourceMappingURL=IdentityExistsOnlyIfIdentityIsAllowed.js.map