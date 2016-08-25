"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class AssociationMustNotDuplicateDomainEntityNames extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        var firstDomainEntityName = context.firstDomainEntity().IdText();
        var secondDomainEntityName = context.secondDomainEntity().IdText();
        if (!firstDomainEntityName.Equals(secondDomainEntityName))
            return true;
        var firstContext = context.firstDomainEntity().withContext();
        var secondContext = context.secondDomainEntity().withContext();
        var firstContextName = firstContext == null ? string.Empty : firstContext.withContextName().ID().GetText();
        var secondContextName = secondContext == null ? string.Empty : secondContext.withContextName().ID().GetText();
        return !firstContextName.Equals(secondContextName);
    }
    getFailureMessage(context) {
        var identifier = context.associationName().GetText();
        var firstDomainEntityName = context.firstDomainEntity().IdText();
        return string.Format("Association '{0}' has duplicate declarations of Domain Entity '{1}'.", identifier, firstDomainEntityName);
    }
}
exports.AssociationMustNotDuplicateDomainEntityNames = AssociationMustNotDuplicateDomainEntityNames;
//# sourceMappingURL=AssociationMustNotDuplicateDomainEntityNames.js.map