"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;
class AssociationMustNotDuplicateDomainEntityNames extends ValidationRuleBase_1.ValidationRuleBase {
    handlesContext(context) {
        return context.ruleIndex === MetaEdGrammar.RULE_association;
    }
    isValid(context) {
        let firstDomainEntityName = context.firstDomainEntity().IdText();
        let secondDomainEntityName = context.secondDomainEntity().IdText();
        if (!firstDomainEntityName.Equals(secondDomainEntityName))
            return true;
        let firstContext = context.firstDomainEntity().withContext();
        let secondContext = context.secondDomainEntity().withContext();
        let firstContextName = firstContext == null ? "" : firstContext.withContextName().ID().GetText();
        let secondContextName = secondContext == null ? "" : secondContext.withContextName().ID().GetText();
        return !firstContextName.Equals(secondContextName);
    }
    getFailureMessage(context) {
        let identifier = context.associationName().GetText();
        let firstDomainEntityName = context.firstDomainEntity().IdText();
        return `Association '${identifier}' has duplicate declarations of Domain Entity '${firstDomainEntityName}'`;
    }
}
exports.AssociationMustNotDuplicateDomainEntityNames = AssociationMustNotDuplicateDomainEntityNames;
//# sourceMappingURL=AssociationMustNotDuplicateDomainEntityNames.js.map