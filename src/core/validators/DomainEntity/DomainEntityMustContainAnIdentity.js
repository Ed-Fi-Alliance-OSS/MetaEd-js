"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class DomainEntityMustContainAnIdentity extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        return context.property().Any(x => x.GetProperty().propertyComponents().propertyAnnotation().identity() != null);
    }
    getFailureMessage(context) {
        return `Domain Entity ${context.entityName().ID().GetText()} does not have an identity specified.`;
    }
}
exports.DomainEntityMustContainAnIdentity = DomainEntityMustContainAnIdentity;
//# sourceMappingURL=DomainEntityMustContainAnIdentity.js.map