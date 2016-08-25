"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    isValid(context) {
        var basedOnName = context.baseName().GetText();
        return this._symbolTable.IdentifiersForEntityType(SymbolTableEntityType.DomainEntityEntityType()).Any(x => x.Equals(basedOnName)) || this._symbolTable.IdentifiersForEntityType(SymbolTableEntityType.AbstractEntityEntityType()).Any(x => x.Equals(basedOnName));
    }
    getFailureMessage(context) {
        return `Domain Entity '${context.entityName().GetText()}' based on '${context.baseName().GetText()}' does not match any declared domain or abstract entity.`;
    }
}
exports.DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity = DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity;
//# sourceMappingURL=DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity.js.map