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
            var Interchange;
            (function (Interchange) {
                class InterchangeMustNotDuplicateInterchangeElementName {
                }
                ValidationRuleBase < MetaEdGrammar.InterchangeContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        InterchangeMustNotDuplicateInterchangeElementName(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        string: [], DuplicateInterchangeElements(MetaEdGrammar, InterchangeContext = context) {
                            var interchangeElements = context.interchangeComponent().interchangeElement().Select(x => x.ID().GetText());
                            //group and filter duplicates
                            return interchangeElements.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
                        },
                        override: bool, IsValid(MetaEdGrammar, InterchangeContext = context) {
                            return !DuplicateInterchangeElements(context).Any();
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, InterchangeContext = context) {
                            var identifier = context.interchangeName().GetText();
                            var duplicateInterchangeElements = DuplicateInterchangeElements(context);
                            return string.Format("Interchange '{0}' declares duplicate interchange element{2} '{1}'.", identifier, string.Join("', '", duplicateInterchangeElements), duplicateInterchangeElements.Count() > 1 ? "s" : string.Empty);
                        }
                    };
            })(Interchange = Validator.Interchange || (Validator.Interchange = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=InterchangeMustNotDuplicateInterchangeElementName.js.map