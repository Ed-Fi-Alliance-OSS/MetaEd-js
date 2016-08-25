"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    isValid(context) {
        var identifierToMatch = context.propertyName().GetText();
        return this._symbolTable.IdentifierExists(SymbolTableEntityType.AbstractEntityEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch);
    }
    getFailureMessage(context) {
        return string.Format("Reference property '{0}' does not match any declared domain entity or subclass, association or subclass, or abstract entity.", context.propertyName().GetText());
    }
}
exports.ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract = ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract;
//# sourceMappingURL=ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract.js.map