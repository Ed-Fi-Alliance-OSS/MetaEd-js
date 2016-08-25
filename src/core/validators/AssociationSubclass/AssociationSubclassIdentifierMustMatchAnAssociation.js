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
        return string.Format("Association '{0}' based on '{1}' does not match any declared Association.", context.associationName().GetText(), context.baseName().GetText());
    }
}
exports.AssociationSubclassIdentifierMustMatchAnAssociation = AssociationSubclassIdentifierMustMatchAnAssociation;
//# sourceMappingURL=AssociationSubclassIdentifierMustMatchAnAssociation.js.map