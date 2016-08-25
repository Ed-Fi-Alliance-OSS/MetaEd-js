"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    isValid(context) {
        var identifierToMatch = context.sharedPropertyType().GetText();
        var commonDecimalType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_DECIMAL);
        return this._symbolTable.IdentifierExists(commonDecimalType, identifierToMatch);
    }
    getFailureMessage(context) {
        return string.Format("Shared property '{0}' does not match any declared common decimal.", context.propertyName().GetText());
    }
}
exports.SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal = SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal;
//# sourceMappingURL=SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal.js.map