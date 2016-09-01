"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
const SymbolTableEntityType_1 = require('../SymbolTableEntityType');
let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;
class SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTableEntityType = new SymbolTableEntityType_1.default();
        this.symbolTable = symbolTable;
    }
    handlesContext(context) {
        return context.ruleIndex === MetaEdGrammar.RULE_secondDomainEntity;
    }
    isValid(context) {
        let identifierToMatch = context.propertyName().ID().getText();
        return this.symbolTable.identifierExists(this.symbolTableEntityType.domainEntityEntityType(), identifierToMatch)
            || this.symbolTable.identifierExists(this.symbolTableEntityType.abstractEntityEntityType(), identifierToMatch)
            || this.symbolTable.identifierExists(this.symbolTableEntityType.domainEntitySubclassEntityType(), identifierToMatch);
    }
    getFailureMessage(context) {
        return `Domain Entity property '${context.propertyName().ID().getText()}' does not match any declared domain or abstract entity.`;
    }
}
exports.SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity = SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity;
//# sourceMappingURL=SecondDomainEntityPropertyMustMatchDomainOrAbstractEntity.js.map