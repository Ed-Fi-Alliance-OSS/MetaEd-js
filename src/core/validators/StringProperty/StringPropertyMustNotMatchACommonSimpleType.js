"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class StringPropertyMustNotMatchACommonSimpleType extends ValidationRuleBase_1.ValidationRuleBase {
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
        return string.Format("String property '{0}' has the same name as a common decimal, integer, short or string.  If intentional, use a shared property instead.", context.propertyName().GetText());
    }
}
exports.StringPropertyMustNotMatchACommonSimpleType = StringPropertyMustNotMatchACommonSimpleType;
//# sourceMappingURL=StringPropertyMustNotMatchACommonSimpleType.js.map