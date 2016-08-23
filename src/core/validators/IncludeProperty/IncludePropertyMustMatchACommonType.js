using;
MetaEd.Grammar.Antlr;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var IncludeProperty;
            (function (IncludeProperty) {
                class IncludePropertyMustMatchACommonType {
                }
                ValidationRuleBase < MetaEdGrammar.IncludePropertyContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        IncludePropertyMustMatchACommonType(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, IncludePropertyContext = context) {
                            var identifierToMatch = context.propertyName().GetText();
                            var commonTypeType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_TYPE);
                            var inlineCommonTypeType = MetaEdGrammar.TokenName(MetaEdGrammar.INLINE_COMMON_TYPE);
                            var choiceCommonType = MetaEdGrammar.TokenName(MetaEdGrammar.CHOICE_TYPE);
                            return _symbolTable.IdentifierExists(commonTypeType, identifierToMatch) ||
                                _symbolTable.IdentifierExists(inlineCommonTypeType, identifierToMatch) ||
                                _symbolTable.IdentifierExists(choiceCommonType, identifierToMatch);
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, IncludePropertyContext = context) {
                            return string.Format("Include property '{0}' does not match any declared common type.", context.propertyName().GetText());
                        }
                    };
            })(IncludeProperty = Validator.IncludeProperty || (Validator.IncludeProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=IncludePropertyMustMatchACommonType.js.map