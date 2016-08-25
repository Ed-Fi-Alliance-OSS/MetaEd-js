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
        return string.Format("Shared property '{0}' does not match any declared common string.", context.propertyName().GetText());
    }
}
exports.SharedStringPropertyTypeMustMatchACommonSimpleString = SharedStringPropertyTypeMustMatchACommonSimpleString;
//# sourceMappingURL=SharedStringPropertyTypeMustMatchACommonSimpleString.js.map