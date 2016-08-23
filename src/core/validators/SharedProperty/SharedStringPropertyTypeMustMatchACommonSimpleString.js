var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var SharedProperty;
            (function (SharedProperty) {
                class SharedStringPropertyTypeMustMatchACommonSimpleString extends ValidationRuleBase {
                    constructor(symbolTable) {
                        this._symbolTable = symbolTable;
                    }
                    isValid(context) {
                        var identifierToMatch = context.sharedPropertyType().GetText();
                        var commonStringType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_STRING);
                        return this._symbolTable.IdentifierExists(commonStringType, identifierToMatch);
                    }
                    getFailureMessage(context) {
                        return string.Format("Shared property '{0}' does not match any declared common string.", context.propertyName().GetText());
                    }
                }
                SharedProperty.SharedStringPropertyTypeMustMatchACommonSimpleString = SharedStringPropertyTypeMustMatchACommonSimpleString;
            })(SharedProperty = Validator.SharedProperty || (Validator.SharedProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=SharedStringPropertyTypeMustMatchACommonSimpleString.js.map