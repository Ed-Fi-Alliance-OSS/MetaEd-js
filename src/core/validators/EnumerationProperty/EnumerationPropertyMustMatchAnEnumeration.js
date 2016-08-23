using;
MetaEd.Grammar.Antlr;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var EnumerationProperty;
            (function (EnumerationProperty) {
                class EnumerationPropertyMustMatchAnEnumeration {
                }
                ValidationRuleBase < MetaEdGrammar.EnumerationPropertyContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        EnumerationPropertyMustMatchAnEnumeration(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, EnumerationPropertyContext = context) {
                            var identifierToMatch = context.propertyName().GetText();
                            return _symbolTable.IdentifierExists(SymbolTableEntityType.EnumerationEntityType(), identifierToMatch);
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, EnumerationPropertyContext = context) {
                            return string.Format("Enumeration property '{0}' does not match any declared enumeration.", context.propertyName().GetText());
                        }
                    };
            })(EnumerationProperty = Validator.EnumerationProperty || (Validator.EnumerationProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=EnumerationPropertyMustMatchAnEnumeration.js.map