var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var SharedProperty;
            (function (SharedProperty) {
                class SharedShortPropertyTypeMustMatchACommonSimpleShort extends ValidationRuleBase {
                    constructor(symbolTable) {
                        this._symbolTable = symbolTable;
                    }
                    isValid(context) {
                        var identifierToMatch = context.sharedPropertyType().GetText();
                        var commonShortType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_SHORT);
                        return this._symbolTable.IdentifierExists(commonShortType, identifierToMatch);
                    }
                    getFailureMessage(context) {
                        return string.Format("Shared property '{0}' does not match any declared common short.", context.propertyName().GetText());
                    }
                }
                SharedProperty.SharedShortPropertyTypeMustMatchACommonSimpleShort = SharedShortPropertyTypeMustMatchACommonSimpleShort;
            })(SharedProperty = Validator.SharedProperty || (Validator.SharedProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=SharedShortPropertyTypeMustMatchACommonSimpleShort.js.map