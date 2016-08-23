using;
MetaEd.Grammar.Antlr;
using;
MetaEd.Grammar.Antlr.Extensions;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var Domain;
            (function (Domain) {
                class DomainItemMustMatchTopLevelEntity {
                }
                ValidationRuleBase < MetaEdGrammar.DomainItemContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        DomainItemMustMatchTopLevelEntity(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, DomainItemContext = context) {
                            var identifierToMatch = context.IdText();
                            return _symbolTable.IdentifierExists(SymbolTableEntityType.AbstractEntityEntityType(), identifierToMatch) ||
                                _symbolTable.IdentifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) ||
                                _symbolTable.IdentifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch) ||
                                _symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) ||
                                _symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch) ||
                                _symbolTable.IdentifierExists(SymbolTableEntityType.CommonTypeEntityType(), identifierToMatch) ||
                                _symbolTable.IdentifierExists(SymbolTableEntityType.InlineCommonTypeEntityType(), identifierToMatch);
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, DomainItemContext = context) {
                            var topLevelEntity = context.GetAncestorContext();
                            return string.Format("Domain item '{0}' under {1} '{2}' does not match any declared abstract entity, domain entity or subclass, association or subclass, or common type.", context.IdText(), topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName());
                        }
                    };
            })(Domain = Validator.Domain || (Validator.Domain = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainItemMustMatchTopLevelEntity.js.map