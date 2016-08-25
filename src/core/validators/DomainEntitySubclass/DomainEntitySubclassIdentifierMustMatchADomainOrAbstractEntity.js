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
        return string.Format("Domain Entity '{0}' based on '{1}' does not match any declared domain or abstract entity.", context.entityName().GetText(), context.baseName().GetText());
    }
}
exports.DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity = DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity;
//# sourceMappingURL=DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity.js.map