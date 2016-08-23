using;
MetaEd.Grammar.Antlr;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var DecimalProperty;
            (function (DecimalProperty) {
                class DecimalPropertyMustNotMatchACommonSimpleType {
                }
                ValidationRuleBase < MetaEdGrammar.DecimalPropertyContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        DecimalPropertyMustNotMatchACommonSimpleType(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, DecimalPropertyContext = context) {
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
                        override: string, GetFailureMessage(MetaEdGrammar, DecimalPropertyContext = context) {
                            return string.Format("Decimal property '{0}' has the same name as a common decimal, integer, short or string.  If intentional, use a shared property instead.", context.propertyName().GetText());
                        }
                    };
            })(DecimalProperty = Validator.DecimalProperty || (Validator.DecimalProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DecimalPropertyMustNotMatchACommonSimpleType.js.map