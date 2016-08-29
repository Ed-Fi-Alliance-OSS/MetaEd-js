"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class IncludePropertyMustMatchACommonType extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        let identifierToMatch = context.propertyName().GetText();
        let commonTypeType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_TYPE);
        let inlineCommonTypeType = MetaEdGrammar.TokenName(MetaEdGrammar.INLINE_COMMON_TYPE);
        let choiceCommonType = MetaEdGrammar.TokenName(MetaEdGrammar.CHOICE_TYPE);
        return this.symbolTable.identifierExists(commonTypeType, identifierToMatch) || this.symbolTable.identifierExists(inlineCommonTypeType, identifierToMatch) || this.symbolTable.identifierExists(choiceCommonType, identifierToMatch);
    }
    getFailureMessage(context) {
        return `Include property '${context.propertyName().GetText()}' does not match any declared common type.`;
    }
}
exports.IncludePropertyMustMatchACommonType = IncludePropertyMustMatchACommonType;
//# sourceMappingURL=IncludePropertyMustMatchACommonType.js.map