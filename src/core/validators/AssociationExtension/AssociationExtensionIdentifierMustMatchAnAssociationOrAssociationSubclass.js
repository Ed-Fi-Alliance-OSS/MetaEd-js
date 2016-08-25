"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    isValid(context) {
        var identifierToMatch = context.extendeeName().GetText();
        return this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch);
    }
    getFailureMessage(context) {
        return string.Format("Association additions '{0}' does not match any declared Association or subclass.", context.extendeeName().GetText());
    }
}
exports.AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass = AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass;
//# sourceMappingURL=AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass.js.map