"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class AbstractEntityMustContainAnIdentity extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        return context.property().some(x => this.getProperty(x).propertyComponents().propertyAnnotation().identity() != null);
    }
    getFailureMessage(context) {
        return `Abstract Entity ${context.abstractEntityName().ID().getText()} does not have an identity specified.`;
    }
}
exports.AbstractEntityMustContainAnIdentity = AbstractEntityMustContainAnIdentity;
//# sourceMappingURL=AbstractEntityMustContainAnIdentity.js.map