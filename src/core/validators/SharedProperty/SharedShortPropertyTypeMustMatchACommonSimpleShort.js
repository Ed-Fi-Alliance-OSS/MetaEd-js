"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class SharedShortPropertyTypeMustMatchACommonSimpleShort extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    isValid(context) {
        var identifierToMatch = context.sharedPropertyType().GetText();
        var commonShortType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_SHORT);
        return this._symbolTable.IdentifierExists(commonShortType, identifierToMatch);
    }
    getFailureMessage(context) {
        return `Shared property '${context.propertyName().GetText()}' does not match any declared common short.`;
    }
}
exports.SharedShortPropertyTypeMustMatchACommonSimpleShort = SharedShortPropertyTypeMustMatchACommonSimpleShort;
//# sourceMappingURL=SharedShortPropertyTypeMustMatchACommonSimpleShort.js.map