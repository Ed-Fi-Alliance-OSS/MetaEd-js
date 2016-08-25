"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class IncludePropertyMustNotContainIdentity extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        return context.propertyComponents().propertyAnnotation().identity() == null;
    }
    getFailureMessage(context) {
        var topLevelEntity = context.GetAncestorContext();
        return string.Format("Include property '{0}' is invalid to be used for the identity of {1} '{2}'", context.propertyName().GetText(), topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName());
    }
}
exports.IncludePropertyMustNotContainIdentity = IncludePropertyMustNotContainIdentity;
//# sourceMappingURL=IncludePropertyMustNotContainIdentity.js.map