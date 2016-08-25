"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class SharedStringPropertyTypeMustMatchACommonSimpleString extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    isValid(context) {
        var identifierToMatch = context.sharedPropertyType().GetText();
        var commonStringType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_STRING);
        return this._symbolTable.IdentifierExists(commonStringType, identifierToMatch);
    }
    getFailureMessage(context) {
        return `Shared property '${context.propertyName().GetText()}' does not match any declared common string.`;
    }
}
exports.SharedStringPropertyTypeMustMatchACommonSimpleString = SharedStringPropertyTypeMustMatchACommonSimpleString;
//# sourceMappingURL=SharedStringPropertyTypeMustMatchACommonSimpleString.js.map