"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class SharedIntegerPropertyTypeMustMatchACommonSimpleInteger extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    isValid(context) {
        var identifierToMatch = context.sharedPropertyType().GetText();
        var commonIntegerType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_INTEGER);
        return this._symbolTable.IdentifierExists(commonIntegerType, identifierToMatch);
    }
    getFailureMessage(context) {
        return string.Format("Shared property '{0}' does not match any declared common integer.", context.propertyName().GetText());
    }
}
exports.SharedIntegerPropertyTypeMustMatchACommonSimpleInteger = SharedIntegerPropertyTypeMustMatchACommonSimpleInteger;
//# sourceMappingURL=SharedIntegerPropertyTypeMustMatchACommonSimpleInteger.js.map