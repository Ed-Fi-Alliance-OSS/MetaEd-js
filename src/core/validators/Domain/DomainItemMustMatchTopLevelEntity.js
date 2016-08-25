"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class DomainItemMustMatchTopLevelEntity extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    isValid(context) {
        var identifierToMatch = context.IdText();
        return this._symbolTable.IdentifierExists(SymbolTableEntityType.AbstractEntityEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.CommonTypeEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.InlineCommonTypeEntityType(), identifierToMatch);
    }
    getFailureMessage(context) {
        var topLevelEntity = context.GetAncestorContext();
        return string.Format("Domain item '{0}' under {1} '{2}' does not match any declared abstract entity, domain entity or subclass, association or subclass, or common type.", context.IdText(), topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName());
    }
}
exports.DomainItemMustMatchTopLevelEntity = DomainItemMustMatchTopLevelEntity;
//# sourceMappingURL=DomainItemMustMatchTopLevelEntity.js.map