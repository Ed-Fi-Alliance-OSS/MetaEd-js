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
                class SharedIntegerPropertyTypeMustMatchACommonSimpleInteger {
                }
                ValidationRuleBase < MetaEdGrammar.SharedIntegerPropertyContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        SharedIntegerPropertyTypeMustMatchACommonSimpleInteger(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, SharedIntegerPropertyContext = context) {
                            var identifierToMatch = context.sharedPropertyType().GetText();
                            var commonIntegerType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_INTEGER);
                            return _symbolTable.IdentifierExists(commonIntegerType, identifierToMatch);
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, SharedIntegerPropertyContext = context) {
                            return string.Format("Shared property '{0}' does not match any declared common integer.", context.propertyName().GetText());
                        }
                    };
            })(SharedProperty = Validator.SharedProperty || (Validator.SharedProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=SharedIntegerPropertyTypeMustMatchACommonSimpleInteger.js.map