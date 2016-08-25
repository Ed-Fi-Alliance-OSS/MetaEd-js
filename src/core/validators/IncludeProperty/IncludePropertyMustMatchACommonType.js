"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class IncludePropertyMustMatchACommonType extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    isValid(context) {
        var identifierToMatch = context.propertyName().GetText();
        var commonTypeType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_TYPE);
        var inlineCommonTypeType = MetaEdGrammar.TokenName(MetaEdGrammar.INLINE_COMMON_TYPE);
        var choiceCommonType = MetaEdGrammar.TokenName(MetaEdGrammar.CHOICE_TYPE);
        return this._symbolTable.IdentifierExists(commonTypeType, identifierToMatch) || this._symbolTable.IdentifierExists(inlineCommonTypeType, identifierToMatch) || this._symbolTable.IdentifierExists(choiceCommonType, identifierToMatch);
    }
    getFailureMessage(context) {
        return string.Format("Include property '{0}' does not match any declared common type.", context.propertyName().GetText());
    }
}
exports.IncludePropertyMustMatchACommonType = IncludePropertyMustMatchACommonType;
//# sourceMappingURL=IncludePropertyMustMatchACommonType.js.map