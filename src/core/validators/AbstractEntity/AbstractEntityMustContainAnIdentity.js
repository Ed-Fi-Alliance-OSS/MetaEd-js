"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;
class AbstractEntityMustContainAnIdentity extends ValidationRuleBase_1.ValidationRuleBase {
    handlesContext(context) {
        return context.ruleIndex === MetaEdGrammar.RULE_abstractEntity;
    }
    isValid(context) {
        return context.property().some(x => this.getProperty(x).propertyComponents().propertyAnnotation().identity() != null);
    }
    getFailureMessage(context) {
        return `Abstract Entity {context.abstractEntityName().ID().getText()} does not have an identity specified.`;
    }
}
exports.AbstractEntityMustContainAnIdentity = AbstractEntityMustContainAnIdentity;
//# sourceMappingURL=AbstractEntityMustContainAnIdentity.js.map