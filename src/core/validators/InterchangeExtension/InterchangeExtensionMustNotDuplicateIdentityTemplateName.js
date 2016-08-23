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
                class InterchangeExtensionMustNotDuplicateIdentityTemplateName {
                }
                ValidationRuleBase < MetaEdGrammar.InterchangeExtensionContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        InterchangeExtensionMustNotDuplicateIdentityTemplateName(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        string: [], DuplicateIdentityTemplates(MetaEdGrammar, InterchangeExtensionContext = context) {
                            var identityTemplates = context.interchangeExtensionComponent().interchangeIdentityTemplate().Select(x => x.ID().GetText());
                            //group and filter duplicates
                            return identityTemplates.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
                        },
                        override: bool, IsValid(MetaEdGrammar, InterchangeExtensionContext = context) {
                            return !DuplicateIdentityTemplates(context).Any();
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, InterchangeExtensionContext = context) {
                            var identifier = context.extendeeName().GetText();
                            var duplicateIdentityTemplates = DuplicateIdentityTemplates(context);
                            return string.Format("Interchange additions '{0}' declares duplicate identity template{2} '{1}'.", identifier, string.Join("', '", duplicateIdentityTemplates), duplicateIdentityTemplates.Count() > 1 ? "s" : string.Empty);
                        }
                    };
            })(InterchangeExtension = Validator.InterchangeExtension || (Validator.InterchangeExtension = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=InterchangeExtensionMustNotDuplicateIdentityTemplateName.js.map