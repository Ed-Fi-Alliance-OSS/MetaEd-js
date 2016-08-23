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
            var InterchangeExtension;
            (function (InterchangeExtension) {
                class InterchangeExtensionIdentifierMustMatchAnInterchange {
                }
                ValidationRuleBase < MetaEdGrammar.InterchangeExtensionContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        InterchangeExtensionIdentifierMustMatchAnInterchange(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, InterchangeExtensionContext = context) {
                            var entityType = context.INTERCHANGE().GetText();
                            var identifier = context.extendeeName().GetText();
                            return _symbolTable.IdentifiersForEntityType(entityType).Any(x => x.Equals(identifier));
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, InterchangeExtensionContext = context) {
                            return string.Format("Interchange additions '{0}' does not match any declared Interchange.", context.extendeeName().GetText());
                        }
                    };
            })(InterchangeExtension = Validator.InterchangeExtension || (Validator.InterchangeExtension = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=InterchangeExtensionIdentifierMustMatchAnInterchange.js.map