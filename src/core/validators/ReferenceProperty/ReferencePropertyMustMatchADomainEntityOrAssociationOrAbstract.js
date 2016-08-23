using;
MetaEd.Grammar.Antlr;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var ReferenceProperty;
            (function (ReferenceProperty) {
                class ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract {
                }
                ValidationRuleBase < MetaEdGrammar.ReferencePropertyContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, ReferencePropertyContext = context) {
                            var identifierToMatch = context.propertyName().GetText();
                            return _symbolTable.IdentifierExists(SymbolTableEntityType.AbstractEntityEntityType(), identifierToMatch) ||
                                _symbolTable.IdentifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) ||
                                _symbolTable.IdentifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch) ||
                                _symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) ||
                                _symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch);
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, ReferencePropertyContext = context) {
                            return string.Format("Reference property '{0}' does not match any declared domain entity or subclass, association or subclass, or abstract entity.", context.propertyName().GetText());
                        }
                    };
            })(ReferenceProperty = Validator.ReferenceProperty || (Validator.ReferenceProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=ReferencePropertyMustMatchADomainEntityOrAssociationOrAbstract.js.map