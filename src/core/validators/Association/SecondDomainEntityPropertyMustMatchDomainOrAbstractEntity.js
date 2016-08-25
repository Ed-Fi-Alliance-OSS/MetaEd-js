"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    isValid(context) {
        var identifierToMatch = context.IdText();
        return this._symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.AbstractEntityEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch);
    }
    getFailureMessage(context) {
        return string.Format("Domain Entity property '{0}' does not match any declared domain or abstract entity.", context.IdText());
    }
}
exports.SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity = SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity;
//# sourceMappingURL=SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity.js.map