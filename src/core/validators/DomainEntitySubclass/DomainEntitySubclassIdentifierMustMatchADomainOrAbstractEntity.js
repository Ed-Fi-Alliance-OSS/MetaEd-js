using;
System.Linq;
using;
MetaEd.Grammar.Antlr;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var DomainEntitySubclass;
            (function (DomainEntitySubclass) {
                class DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity {
                }
                ValidationRuleBase < MetaEdGrammar.DomainEntitySubclassContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, DomainEntitySubclassContext = context) {
                            var basedOnName = context.baseName().GetText();
                            return _symbolTable.IdentifiersForEntityType(SymbolTableEntityType.DomainEntityEntityType()).Any(x => x.Equals(basedOnName)) ||
                                _symbolTable.IdentifiersForEntityType(SymbolTableEntityType.AbstractEntityEntityType()).Any(x => x.Equals(basedOnName));
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, DomainEntitySubclassContext = context) {
                            return string.Format("Domain Entity '{0}' based on '{1}' does not match any declared domain or abstract entity.", context.entityName().GetText(), context.baseName().GetText());
                        }
                    };
            })(DomainEntitySubclass = Validator.DomainEntitySubclass || (Validator.DomainEntitySubclass = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity.js.map