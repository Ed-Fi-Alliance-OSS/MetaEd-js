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
                class InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass {
                }
                ValidationRuleBase < MetaEdGrammar.InterchangeIdentityTemplateContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, InterchangeIdentityTemplateContext = context) {
                            var identifierToMatch = context.IdText();
                            return _symbolTable.IdentifierExists(SymbolTableEntityType.AbstractEntityEntityType(), identifierToMatch) ||
                                _symbolTable.IdentifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) ||
                                _symbolTable.IdentifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch) ||
                                _symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) ||
                                _symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch);
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, InterchangeIdentityTemplateContext = context) {
                            return string.Format("Interchange identity template '{0}' does not match any declared domain entity or subclass, association or subclass, or abstract entity.", context.IdText());
                        }
                    };
            })(Interchange = Validator.Interchange || (Validator.Interchange = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass.js.map