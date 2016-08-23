var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var IncludeProperty;
            (function (IncludeProperty) {
                class IncludePropertyMustMatchACommonType extends ValidationRuleBase {
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
                IncludeProperty.IncludePropertyMustMatchACommonType = IncludePropertyMustMatchACommonType;
            })(IncludeProperty = Validator.IncludeProperty || (Validator.IncludeProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=IncludePropertyMustMatchACommonType.js.map