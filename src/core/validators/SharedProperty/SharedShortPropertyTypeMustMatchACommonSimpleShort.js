"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class SharedShortPropertyTypeMustMatchACommonSimpleShort extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        let identifierToMatch = context.sharedPropertyType().GetText();
        let commonShortType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_SHORT);
        return this.symbolTable.identifierExists(commonShortType, identifierToMatch);
    }
    getFailureMessage(context) {
        return `Shared property '${context.propertyName().GetText()}' does not match any declared common short.`;
    }
}
exports.SharedShortPropertyTypeMustMatchACommonSimpleShort = SharedShortPropertyTypeMustMatchACommonSimpleShort;
//# sourceMappingURL=SharedShortPropertyTypeMustMatchACommonSimpleShort.js.map