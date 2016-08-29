"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class AssociationSubclassIdentifierMustMatchAnAssociation extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        let associationEntityType = context.ASSOCIATION().GetText();
        let basedOnName = context.baseName().GetText();
        return this.symbolTable.identifiersForEntityType(associationEntityType).Any(x => x.Equals(basedOnName));
    }
    getFailureMessage(context) {
        return `Association '${context.associationName().GetText()}' based on '${context.baseName().GetText()}' does not match any declared Association.`;
    }
}
exports.AssociationSubclassIdentifierMustMatchAnAssociation = AssociationSubclassIdentifierMustMatchAnAssociation;
//# sourceMappingURL=AssociationSubclassIdentifierMustMatchAnAssociation.js.map