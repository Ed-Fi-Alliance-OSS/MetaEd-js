using;
MetaEd.Grammar.Antlr;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var AssociationExtension;
            (function (AssociationExtension) {
                class AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass {
                }
                ValidationRuleBase < MetaEdGrammar.AssociationExtensionContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, AssociationExtensionContext = context) {
                            var identifierToMatch = context.extendeeName().GetText();
                            return _symbolTable.IdentifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) ||
                                _symbolTable.IdentifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch);
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, AssociationExtensionContext = context) {
                            return string.Format("Association additions '{0}' does not match any declared Association or subclass.", context.extendeeName().GetText());
                        }
                    };
            })(AssociationExtension = Validator.AssociationExtension || (Validator.AssociationExtension = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass.js.map