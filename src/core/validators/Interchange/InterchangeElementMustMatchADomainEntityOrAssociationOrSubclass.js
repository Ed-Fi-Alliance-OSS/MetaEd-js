"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    isValid(context) {
        var identifierToMatch = context.IdText();
        return this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch);
    }
    getFailureMessage(context) {
        return string.Format("Interchange element '{0}' does not match any declared domain entity or subclass, association or subclass.", context.IdText());
    }
}
exports.InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass = InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass;
//# sourceMappingURL=InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass.js.map