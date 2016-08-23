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
                class InterchangeExtensionMustNotDuplicateInterchangeElementName {
                }
                ValidationRuleBase < MetaEdGrammar.InterchangeExtensionContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        InterchangeExtensionMustNotDuplicateInterchangeElementName(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        string: [], DuplicateInterchangeElements(MetaEdGrammar, InterchangeExtensionContext = context) {
                            var interchangeElements = context.interchangeExtensionComponent().interchangeElement().Select(x => x.ID().GetText());
                            //group and filter duplicates
                            return interchangeElements.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
                        },
                        override: bool, IsValid(MetaEdGrammar, InterchangeExtensionContext = context) {
                            return !DuplicateInterchangeElements(context).Any();
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, InterchangeExtensionContext = context) {
                            var identifier = context.extendeeName().GetText();
                            var duplicateInterchangeElements = DuplicateInterchangeElements(context);
                            return string.Format("Interchange additions '{0}' declares duplicate interchange element{2} '{1}'.", identifier, string.Join("', '", duplicateInterchangeElements), duplicateInterchangeElements.Count() > 1 ? "s" : string.Empty);
                        }
                    };
            })(InterchangeExtension = Validator.InterchangeExtension || (Validator.InterchangeExtension = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=InterchangeExtensionMustNotDuplicateInterchangeElementName.js.map