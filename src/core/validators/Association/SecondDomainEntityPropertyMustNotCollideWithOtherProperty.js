"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;
class SecondDomainEntityPropertyMustNotCollideWithOtherProperty extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    handlesContext(context) {
        return context.ruleIndex === MetaEdGrammar.RULE_secondDomainEntity;
    }
    isValid(context) {
        let identifierToMatch = context.IdText();
        let withContextContext = context.withContext();
        let withContextPrefix = withContextContext == null ? "" : withContextContext.withContextName().ID().GetText();
        let associationName = context.parent.associationName().IdText();
        let associationType = MetaEdGrammar.TokenName(MetaEdGrammar.ASSOCIATION);
        let entitySymbolTable = this.symbolTable.get(associationType, associationName);
        return entitySymbolTable.propertySymbolTable.get(withContextPrefix + identifierToMatch) == null;
    }
    getFailureMessage(context) {
        let associationName = context.parent.associationName().IdText();
        return `Entity ${associationName} has duplicate properties named ${context.IdText()}`;
    }
}
exports.SecondDomainEntityPropertyMustNotCollideWithOtherProperty = SecondDomainEntityPropertyMustNotCollideWithOtherProperty;
//# sourceMappingURL=SecondDomainEntityPropertyMustNotCollideWithOtherProperty.js.map