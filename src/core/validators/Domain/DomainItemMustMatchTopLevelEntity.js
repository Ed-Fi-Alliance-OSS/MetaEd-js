"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
const SymbolTableEntityType_1 = require('../SymbolTableEntityType');
class DomainItemMustMatchTopLevelEntity extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTableEntityType = new SymbolTableEntityType_1.default();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        let identifierToMatch = context.IdText();
        return this.symbolTable.identifierExists(this.symbolTableEntityType.abstractEntityEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.associationEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.associationSubclassEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.domainEntityEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.domainEntitySubclassEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.commonTypeEntityType(), identifierToMatch) || this.symbolTable.identifierExists(this.symbolTableEntityType.inlineCommonTypeEntityType(), identifierToMatch);
    }
    getFailureMessage(context) {
        let topLevelEntity = context.GetAncestorContext();
        return `Domain item '${context.IdText()}' under ${topLevelEntity.EntityIdentifier()} '${topLevelEntity.EntityName()}' does not match any declared abstract entity, domain entity or subclass, association or subclass, or common type.`;
    }
}
exports.DomainItemMustMatchTopLevelEntity = DomainItemMustMatchTopLevelEntity;
//# sourceMappingURL=DomainItemMustMatchTopLevelEntity.js.map