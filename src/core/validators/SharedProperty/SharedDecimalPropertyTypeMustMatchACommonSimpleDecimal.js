using;
MetaEd.Grammar.Antlr;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var SharedProperty;
            (function (SharedProperty) {
                class SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal {
                }
                ValidationRuleBase < MetaEdGrammar.SharedDecimalPropertyContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, SharedDecimalPropertyContext = context) {
                            var identifierToMatch = context.sharedPropertyType().GetText();
                            var commonDecimalType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_DECIMAL);
                            return _symbolTable.IdentifierExists(commonDecimalType, identifierToMatch);
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, SharedDecimalPropertyContext = context) {
                            return string.Format("Shared property '{0}' does not match any declared common decimal.", context.propertyName().GetText());
                        }
                    };
            })(SharedProperty = Validator.SharedProperty || (Validator.SharedProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=SharedDecimalPropertyTypeMustMatchACommonSimpleDecimal.js.map