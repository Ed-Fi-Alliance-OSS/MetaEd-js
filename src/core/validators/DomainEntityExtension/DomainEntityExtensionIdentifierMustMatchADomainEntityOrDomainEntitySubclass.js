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
            var DomainEntityExtension;
            (function (DomainEntityExtension) {
                class DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass {
                }
                ValidationRuleBase < MetaEdGrammar.DomainEntityExtensionContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, DomainEntityExtensionContext = context) {
                            var identifier = context.extendeeName().GetText();
                            return _symbolTable.IdentifiersForEntityType(SymbolTableEntityType.DomainEntityEntityType()).Any(x => x.Equals(identifier)) ||
                                _symbolTable.IdentifiersForEntityType(SymbolTableEntityType.DomainEntitySubclassEntityType()).Any(x => x.Equals(identifier));
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, DomainEntityExtensionContext = context) {
                            return string.Format("Domain Entity additions '{0}' does not match any declared Domain Entity or Domain Entity Subclass.", context.extendeeName().GetText());
                        }
                    };
            })(DomainEntityExtension = Validator.DomainEntityExtension || (Validator.DomainEntityExtension = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainEntityExtensionIdentifierMustMatchADomainEntityOrDomainEntitySubclass.js.map