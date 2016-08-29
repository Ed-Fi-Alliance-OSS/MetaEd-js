"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
const SymbolTableEntityType_1 = require('../SymbolTableEntityType');
class AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTableEntityType = new SymbolTableEntityType_1.default();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        let identifierToMatch = context.extendeeName().GetText();
        return this.symbolTable.identifierExists(this.symbolTableEntityType.associationEntityType(), identifierToMatch)
            || this.symbolTable.identifierExists(this.symbolTableEntityType.associationSubclassEntityType(), identifierToMatch);
    }
    getFailureMessage(context) {
        return `Association additions '${context.extendeeName().GetText()}' does not match any declared Association or subclass.`;
    }
}
exports.AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass = AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass;
//# sourceMappingURL=AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass.js.map