"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
const SymbolTableEntityType_1 = require('../SymbolTableEntityType');
class InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTableEntityType = new SymbolTableEntityType_1.default();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        let identifierToMatch = context.IdText();
        return this.symbolTable.identifierExists(this.symbolTableEntityType.abstractEntityEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.associationEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.associationSubclassEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.domainEntityEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.domainEntitySubclassEntityType(), identifierToMatch);
    }
    getFailureMessage(context) {
        return `Interchange identity template '${context.IdText()}' does not match any declared domain entity or subclass, association or subclass, or abstract entity.`;
    }
}
exports.InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass = InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass;
//# sourceMappingURL=InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass.js.map