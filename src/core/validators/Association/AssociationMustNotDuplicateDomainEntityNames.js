"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;
class AssociationMustNotDuplicateDomainEntityNames extends ValidationRuleBase_1.ValidationRuleBase {
    handlesContext(context) {
        return context.ruleIndex === MetaEdGrammar.RULE_association;
    }
    isValid(context) {
        let firstDomainEntityName = context.firstDomainEntity().propertyName().ID().getText();
        let secondDomainEntityName = context.secondDomainEntity().propertyName().ID().getText();
        if (firstDomainEntityName !== secondDomainEntityName)
            return true;
        let firstContext = context.firstDomainEntity().withContext();
        let secondContext = context.secondDomainEntity().withContext();
        let firstContextName = firstContext == null ? "" : firstContext.withContextName().ID().getText();
        let secondContextName = secondContext == null ? "" : secondContext.withContextName().ID().getText();
        return firstContextName !== secondContextName;
    }
    getFailureMessage(context) {
        let identifier = context.associationName().getText();
        let firstDomainEntityName = context.firstDomainEntity().propertyName().ID().getText();
        return `Association '${identifier}' has duplicate declarations of Domain Entity '${firstDomainEntityName}'`;
    }
}
exports.AssociationMustNotDuplicateDomainEntityNames = AssociationMustNotDuplicateDomainEntityNames;
//# sourceMappingURL=AssociationMustNotDuplicateDomainEntityNames.js.map