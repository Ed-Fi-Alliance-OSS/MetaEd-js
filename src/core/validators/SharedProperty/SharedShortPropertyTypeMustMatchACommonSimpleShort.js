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
                class SharedShortPropertyTypeMustMatchACommonSimpleShort {
                }
                ValidationRuleBase < MetaEdGrammar.SharedShortPropertyContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        SharedShortPropertyTypeMustMatchACommonSimpleShort(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, SharedShortPropertyContext = context) {
                            var identifierToMatch = context.sharedPropertyType().GetText();
                            var commonShortType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_SHORT);
                            return _symbolTable.IdentifierExists(commonShortType, identifierToMatch);
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, SharedShortPropertyContext = context) {
                            return string.Format("Shared property '{0}' does not match any declared common short.", context.propertyName().GetText());
                        }
                    };
            })(SharedProperty = Validator.SharedProperty || (Validator.SharedProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=SharedShortPropertyTypeMustMatchACommonSimpleShort.js.map