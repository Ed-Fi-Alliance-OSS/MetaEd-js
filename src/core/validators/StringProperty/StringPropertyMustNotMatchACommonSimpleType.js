using;
MetaEd.Grammar.Antlr;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var StringProperty;
            (function (StringProperty) {
                class StringPropertyMustNotMatchACommonSimpleType {
                }
                ValidationRuleBase < MetaEdGrammar.StringPropertyContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        StringPropertyMustNotMatchACommonSimpleType(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, StringPropertyContext = context) {
                            var identifierToMatch = context.propertyName().GetText();
                            var commonDecimalType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_DECIMAL);
                            var commonIntegerType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_INTEGER);
                            var commonShortType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_SHORT);
                            var commonStringType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_STRING);
                            return !(_symbolTable.IdentifierExists(commonDecimalType, identifierToMatch) ||
                                _symbolTable.IdentifierExists(commonIntegerType, identifierToMatch) ||
                                _symbolTable.IdentifierExists(commonShortType, identifierToMatch) ||
                                _symbolTable.IdentifierExists(commonStringType, identifierToMatch));
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, StringPropertyContext = context) {
                            return string.Format("String property '{0}' has the same name as a common decimal, integer, short or string.  If intentional, use a shared property instead.", context.propertyName().GetText());
                        }
                    };
            })(StringProperty = Validator.StringProperty || (Validator.StringProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=StringPropertyMustNotMatchACommonSimpleType.js.map