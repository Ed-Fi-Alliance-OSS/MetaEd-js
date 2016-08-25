"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class AssociationSubclassIdentifierMustMatchAnAssociation extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    isValid(context) {
        var associationEntityType = context.ASSOCIATION().GetText();
        var basedOnName = context.baseName().GetText();
        return this._symbolTable.IdentifiersForEntityType(associationEntityType).Any(x => x.Equals(basedOnName));
    }
    getFailureMessage(context) {
        return `Association '${context.associationName().GetText()}' based on '${context.baseName().GetText()}' does not match any declared Association.`;
    }
}
exports.AssociationSubclassIdentifierMustMatchAnAssociation = AssociationSubclassIdentifierMustMatchAnAssociation;
//# sourceMappingURL=AssociationSubclassIdentifierMustMatchAnAssociation.js.map