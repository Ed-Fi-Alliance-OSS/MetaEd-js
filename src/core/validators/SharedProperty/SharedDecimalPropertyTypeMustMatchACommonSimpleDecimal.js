"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        let identifierToMatch = context.sharedPropertyType().GetText();
        let commonDecimalType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_DECIMAL);
        return this.symbolTable.identifierExists(commonDecimalType, identifierToMatch);
    }
    getFailureMessage(context) {
        return `Shared property '${}' does not match any declared common decimal.", context.propertyName().GetText());
    }
}
;
    }
}
exports.SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal = SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal;
//# sourceMappingURL=SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal.js.map