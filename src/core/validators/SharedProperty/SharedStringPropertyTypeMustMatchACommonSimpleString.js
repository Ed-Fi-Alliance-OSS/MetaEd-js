"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class SharedStringPropertyTypeMustMatchACommonSimpleString extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        let identifierToMatch = context.sharedPropertyType().GetText();
        let commonStringType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_STRING);
        return this.symbolTable.identifierExists(commonStringType, identifierToMatch);
    }
    getFailureMessage(context) {
        return `Shared property '${context.propertyName().GetText()}' does not match any declared common string.`;
    }
}
exports.SharedStringPropertyTypeMustMatchACommonSimpleString = SharedStringPropertyTypeMustMatchACommonSimpleString;
//# sourceMappingURL=SharedStringPropertyTypeMustMatchACommonSimpleString.js.map