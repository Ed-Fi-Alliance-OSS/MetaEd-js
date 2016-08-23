using;
MetaEd.Grammar.Antlr;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var Interchange;
            (function (Interchange) {
                class InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass {
                }
                ValidationRuleBase < MetaEdGrammar.InterchangeElementContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, InterchangeElementContext = context) {
                            var identifierToMatch = context.IdText();
                            return _symbolTable.IdentifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) ||
                                _symbolTable.IdentifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch) ||
                                _symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) ||
                                _symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch);
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, InterchangeElementContext = context) {
                            return string.Format("Interchange element '{0}' does not match any declared domain entity or subclass, association or subclass.", context.IdText());
                        }
                    };
            })(Interchange = Validator.Interchange || (Validator.Interchange = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass.js.map