using;
MetaEd.Grammar.Antlr;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var Association;
            (function (Association) {
                class FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity {
                }
                ValidationRuleBase < MetaEdGrammar.FirstDomainEntityContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, FirstDomainEntityContext = context) {
                            var identifierToMatch = context.IdText();
                            return _symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) ||
                                _symbolTable.IdentifierExists(SymbolTableEntityType.AbstractEntityEntityType(), identifierToMatch) ||
                                _symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch);
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, FirstDomainEntityContext = context) {
                            return string.Format("Domain Entity property '{0}' does not match any declared domain or abstract entity.", context.IdText());
                        }
                    };
            })(Association = Validator.Association || (Validator.Association = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=FirstDomainEntityPropertyMustMatchDomainOrAbstractEntity.js.map