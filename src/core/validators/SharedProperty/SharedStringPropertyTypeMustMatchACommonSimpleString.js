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
                class SharedStringPropertyTypeMustMatchACommonSimpleString {
                }
                ValidationRuleBase < MetaEdGrammar.SharedStringPropertyContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        SharedStringPropertyTypeMustMatchACommonSimpleString(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, SharedStringPropertyContext = context) {
                            var identifierToMatch = context.sharedPropertyType().GetText();
                            var commonStringType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_STRING);
                            return _symbolTable.IdentifierExists(commonStringType, identifierToMatch);
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, SharedStringPropertyContext = context) {
                            return string.Format("Shared property '{0}' does not match any declared common string.", context.propertyName().GetText());
                        }
                    };
            })(SharedProperty = Validator.SharedProperty || (Validator.SharedProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=SharedStringPropertyTypeMustMatchACommonSimpleString.js.map