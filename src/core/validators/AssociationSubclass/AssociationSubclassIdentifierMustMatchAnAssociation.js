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
            var AssociationSubclass;
            (function (AssociationSubclass) {
                class AssociationSubclassIdentifierMustMatchAnAssociation {
                }
                ValidationRuleBase < MetaEdGrammar.AssociationSubclassContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        AssociationSubclassIdentifierMustMatchAnAssociation(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, AssociationSubclassContext = context) {
                            var associationEntityType = context.ASSOCIATION().GetText();
                            var basedOnName = context.baseName().GetText();
                            return _symbolTable.IdentifiersForEntityType(associationEntityType).Any(x => x.Equals(basedOnName));
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, AssociationSubclassContext = context) {
                            return string.Format("Association '{0}' based on '{1}' does not match any declared Association.", context.associationName().GetText(), context.baseName().GetText());
                        }
                    };
            })(AssociationSubclass = Validator.AssociationSubclass || (Validator.AssociationSubclass = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=AssociationSubclassIdentifierMustMatchAnAssociation.js.map