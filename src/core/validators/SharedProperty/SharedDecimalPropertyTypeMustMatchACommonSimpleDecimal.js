var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var SharedProperty;
            (function (SharedProperty) {
                class SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal extends ValidationRuleBase {
                    constructor(symbolTable) {
                        this._symbolTable = symbolTable;
                    }
                    isValid(context) {
                        var identifierToMatch = context.sharedPropertyType().GetText();
                        var commonDecimalType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_DECIMAL);
                        return this._symbolTable.IdentifierExists(commonDecimalType, identifierToMatch);
                    }
                    getFailureMessage(context) {
                        return string.Format("Shared property '{0}' does not match any declared common decimal.", context.propertyName().GetText());
                    }
                }
                SharedProperty.SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal = SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal;
            })(SharedProperty = Validator.SharedProperty || (Validator.SharedProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal.js.map