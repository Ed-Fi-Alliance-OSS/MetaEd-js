"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
const SymbolTableEntityType_1 = require('../SymbolTableEntityType');
let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;
class FirstDomainEntityPropertyMustNotCollideWithOtherProperty extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTableEntityType = new SymbolTableEntityType_1.default();
        this.symbolTable = symbolTable;
    }
    handlesContext(context) {
        return context.ruleIndex === MetaEdGrammar.RULE_firstDomainEntity;
    }
    isValid(context) {
        let identifierToMatch = context.propertyName().ID().getText();
        let withContextContext = context.withContext();
        let withContextPrefix = withContextContext == null ? "" : withContextContext.withContextName().ID().getText();
        let associationName = context.parentCtx.associationName().ID().getText();
        let entitySymbolTable = this.symbolTable.get(this.symbolTableEntityType.associationEntityType(), associationName);
        return entitySymbolTable.propertySymbolTable.get(withContextPrefix + identifierToMatch) == null;
    }
    getFailureMessage(context) {
        let associationName = context.parentCtx.associationName().ID().getText();
        return `Entity ${associationName} has duplicate properties named ${context.propertyName().ID().getText()}`;
    }
}
exports.FirstDomainEntityPropertyMustNotCollideWithOtherProperty = FirstDomainEntityPropertyMustNotCollideWithOtherProperty;
//# sourceMappingURL=FirstDomainEntityPropertyMustNotCollideWithOtherProperty.js.map