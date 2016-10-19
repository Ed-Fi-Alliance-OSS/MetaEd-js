"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class SharedIntegerPropertyTypeMustMatchACommonSimpleInteger extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        let identifierToMatch = context.sharedPropertyType().GetText();
        let commonIntegerType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_INTEGER);
        return this.symbolTable.identifierExists(commonIntegerType, identifierToMatch);
    }
    getFailureMessage(context) {
        return `Shared property '${context.propertyName().GetText()}' does not match any declared common integer.", );
    }
}
;
    }
}
exports.SharedIntegerPropertyTypeMustMatchACommonSimpleInteger = SharedIntegerPropertyTypeMustMatchACommonSimpleInteger;
//# sourceMappingURL=SharedIntegerPropertyTypeMustMatchACommonSimpleInteger.js.map