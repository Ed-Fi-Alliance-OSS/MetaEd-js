var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var StringProperty;
            (function (StringProperty) {
                class StringPropertyMustNotMatchACommonSimpleType extends ValidationRuleBase {
                    constructor(symbolTable) {
                        this._symbolTable = symbolTable;
                    }
                    isValid(context) {
                        var identifierToMatch = context.propertyName().GetText();
                        var commonDecimalType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_DECIMAL);
                        var commonIntegerType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_INTEGER);
                        var commonShortType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_SHORT);
                        var commonStringType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_STRING);
                        return !(this._symbolTable.IdentifierExists(commonDecimalType, identifierToMatch) || this._symbolTable.IdentifierExists(commonIntegerType, identifierToMatch) || this._symbolTable.IdentifierExists(commonShortType, identifierToMatch) || this._symbolTable.IdentifierExists(commonStringType, identifierToMatch));
                    }
                    getFailureMessage(context) {
                        return string.Format("String property '{0}' has the same name as a common decimal, integer, short or string.  If intentional, use a shared property instead.", context.propertyName().GetText());
                    }
                }
                StringProperty.StringPropertyMustNotMatchACommonSimpleType = StringPropertyMustNotMatchACommonSimpleType;
            })(StringProperty = Validator.StringProperty || (Validator.StringProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=StringPropertyMustNotMatchACommonSimpleType.js.map