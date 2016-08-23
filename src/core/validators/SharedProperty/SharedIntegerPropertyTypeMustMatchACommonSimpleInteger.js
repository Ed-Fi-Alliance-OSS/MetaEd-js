var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var SharedProperty;
            (function (SharedProperty) {
                class SharedIntegerPropertyTypeMustMatchACommonSimpleInteger extends ValidationRuleBase {
                    constructor(symbolTable) {
                        this._symbolTable = symbolTable;
                    }
                    isValid(context) {
                        var identifierToMatch = context.sharedPropertyType().GetText();
                        var commonIntegerType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_INTEGER);
                        return this._symbolTable.IdentifierExists(commonIntegerType, identifierToMatch);
                    }
                    getFailureMessage(context) {
                        return string.Format("Shared property '{0}' does not match any declared common integer.", context.propertyName().GetText());
                    }
                }
                SharedProperty.SharedIntegerPropertyTypeMustMatchACommonSimpleInteger = SharedIntegerPropertyTypeMustMatchACommonSimpleInteger;
            })(SharedProperty = Validator.SharedProperty || (Validator.SharedProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=SharedIntegerPropertyTypeMustMatchACommonSimpleInteger.js.map