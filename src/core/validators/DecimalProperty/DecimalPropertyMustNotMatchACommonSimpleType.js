"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class DecimalPropertyMustNotMatchACommonSimpleType extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        let identifierToMatch = context.propertyName().GetText();
        let commonDecimalType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_DECIMAL);
        let commonIntegerType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_INTEGER);
        let commonShortType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_SHORT);
        let commonStringType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_STRING);
        return !(this.symbolTable.identifierExists(commonDecimalType, identifierToMatch) || this.symbolTable.identifierExists(commonIntegerType, identifierToMatch) || this.symbolTable.identifierExists(commonShortType, identifierToMatch) || this.symbolTable.identifierExists(commonStringType, identifierToMatch));
    }
    getFailureMessage(context) {
        return `Decimal property '${context.propertyName().GetText()}' has the same name as a common decimal, integer, short or string.  If intentional, use a shared property instead.`;
    }
}
exports.DecimalPropertyMustNotMatchACommonSimpleType = DecimalPropertyMustNotMatchACommonSimpleType;
//# sourceMappingURL=DecimalPropertyMustNotMatchACommonSimpleType.js.map