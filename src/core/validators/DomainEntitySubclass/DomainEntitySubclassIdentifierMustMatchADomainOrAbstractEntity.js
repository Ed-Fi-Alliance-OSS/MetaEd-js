"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
const SymbolTableEntityType_1 = require('../SymbolTableEntityType');
class DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTableEntityType = new SymbolTableEntityType_1.default();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        let basedOnName = context.baseName().GetText();
        return this.symbolTable.identifiersForEntityType(this.symbolTableEntityType.domainEntityEntityType()).Any(x => x.Equals(basedOnName)) || this.symbolTable.identifiersForEntityType(this.symbolTableEntityType.abstractEntityEntityType()).Any(x => x.Equals(basedOnName));
    }
    getFailureMessage(context) {
        return `Domain Entity '${context.entityName().GetText()}' based on '${context.baseName().GetText()}' does not match any declared domain or abstract entity.`;
    }
}
exports.DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity = DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity;
//# sourceMappingURL=DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity.js.map