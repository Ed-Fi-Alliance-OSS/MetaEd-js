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
                class InterchangeMustNotDuplicateIdentityTemplateName {
                }
                ValidationRuleBase < MetaEdGrammar.InterchangeContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        InterchangeMustNotDuplicateIdentityTemplateName(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        string: [], DuplicateIdentityTemplates(MetaEdGrammar, InterchangeContext = context) {
                            var identityTemplates = context.interchangeComponent().interchangeIdentityTemplate().Select(x => x.ID().GetText());
                            //group and filter duplicates
                            return identityTemplates.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
                        },
                        override: bool, IsValid(MetaEdGrammar, InterchangeContext = context) {
                            return !DuplicateIdentityTemplates(context).Any();
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, InterchangeContext = context) {
                            var identifier = context.interchangeName().GetText();
                            var duplicateIdentityTemplates = DuplicateIdentityTemplates(context);
                            return string.Format("Interchange '{0}' declares duplicate identity template{2} '{1}'.", identifier, string.Join("', '", duplicateIdentityTemplates), duplicateIdentityTemplates.Count() > 1 ? "s" : string.Empty);
                        }
                    };
            })(Interchange = Validator.Interchange || (Validator.Interchange = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=InterchangeMustNotDuplicateIdentityTemplateName.js.map