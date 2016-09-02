"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
const SymbolTableEntityType_1 = require('../SymbolTableEntityType');
let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;
class AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTableEntityType = new SymbolTableEntityType_1.default();
        this.symbolTable = symbolTable;
    }
    handlesContext(context) {
        return context.ruleIndex === MetaEdGrammar.RULE_associationExtension;
    }
    isValid(context) {
        let identifierToMatch = context.extendeeName().getText();
        return this.symbolTable.identifierExists(this.symbolTableEntityType.associationEntityType(), identifierToMatch)
            || this.symbolTable.identifierExists(this.symbolTableEntityType.associationSubclassEntityType(), identifierToMatch);
    }
    getFailureMessage(context) {
        return `Association additions '${context.extendeeName().getText()}' does not match any declared Association or subclass.`;
    }
}
exports.AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass = AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass;
//# sourceMappingURL=AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass.js.map