"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class IntegerPropertyMustNotMatchACommonSimpleType extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    isValid(context) {
        var identifierToMatch = context.propertyName().GetText();
        var commonDecimalType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_DECIMAL);
        var commonIntegerType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_INTEGER);
        var commonShortType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_SHORT);
        var commonStringType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_STRING);
        return !(this._symbolTable.IdentifierExists(commonDecimalType, identifierToMatch) || this._symbolTable.IdentifierExists(commonIntegerType, identifierToMatch) || this._symbolTable.IdentifierExists(commonShortType, identifierToMatch) || this._symbolTable.IdentifierExists(commonStringType, identifierToMatch));
    }
    getFailureMessage(context) {
        return `Integer property '${context.propertyName().GetText()}' has the same name as a common decimal, integer, short or string.  If intentional, use a shared property instead.`;
    }
}
exports.IntegerPropertyMustNotMatchACommonSimpleType = IntegerPropertyMustNotMatchACommonSimpleType;
//# sourceMappingURL=IntegerPropertyMustNotMatchACommonSimpleType.js.map