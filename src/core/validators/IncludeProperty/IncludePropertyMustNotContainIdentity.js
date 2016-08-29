"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class IncludePropertyMustNotContainIdentity extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        return context.propertyComponents().propertyAnnotation().identity() == null;
    }
    getFailureMessage(context) {
        let topLevelEntity = context.GetAncestorContext();
        return `Include property '${context.propertyName().GetText()}' is invalid to be used for the identity of ${topLevelEntity.EntityIdentifier()} '${topLevelEntity.EntityName()}'`;
    }
}
exports.IncludePropertyMustNotContainIdentity = IncludePropertyMustNotContainIdentity;
//# sourceMappingURL=IncludePropertyMustNotContainIdentity.js.map