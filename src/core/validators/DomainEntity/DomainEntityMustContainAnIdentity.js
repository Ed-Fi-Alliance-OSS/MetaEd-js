"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class DomainEntityMustContainAnIdentity extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        return context.property().Any(x => x.GetProperty().propertyComponents().propertyAnnotation().identity() != null);
    }
    getFailureMessage(context) {
        return string.Format("Domain Entity {0} does not have an identity specified.", context.entityName().ID().GetText());
    }
}
exports.DomainEntityMustContainAnIdentity = DomainEntityMustContainAnIdentity;
//# sourceMappingURL=DomainEntityMustContainAnIdentity.js.map