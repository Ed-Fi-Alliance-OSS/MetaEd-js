"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class SecondDomainEntityPropertyMustNotCollideWithOtherProperty extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    isValid(context) {
        var identifierToMatch = context.IdText();
        var withContextContext = context.withContext();
        var withContextPrefix = withContextContext == null ? string.Empty : withContextContext.withContextName().ID().GetText();
        var associationName = context.parent.associationName().IdText();
        var associationType = MetaEdGrammar.TokenName(MetaEdGrammar.ASSOCIATION);
        var entitySymbolTable = this._symbolTable.Get(associationType, associationName);
        return entitySymbolTable.PropertySymbolTable.Get(withContextPrefix + identifierToMatch) == null;
    }
    getFailureMessage(context) {
        var associationName = context.parent.associationName().IdText();
        return `Entity ${associationName} has duplicate properties named ${context.IdText()}`;
    }
}
exports.SecondDomainEntityPropertyMustNotCollideWithOtherProperty = SecondDomainEntityPropertyMustNotCollideWithOtherProperty;
//# sourceMappingURL=SecondDomainEntityPropertyMustNotCollideWithOtherProperty.js.map