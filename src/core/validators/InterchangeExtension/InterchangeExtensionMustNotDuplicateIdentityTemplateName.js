var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var InterchangeExtension;
            (function (InterchangeExtension) {
                class InterchangeExtensionMustNotDuplicateIdentityTemplateName extends ValidationRuleBase {
                    constructor(symbolTable) {
                        this._symbolTable = symbolTable;
                    }
                    static duplicateIdentityTemplates(context) {
                        var identityTemplates = context.interchangeExtensionComponent().interchangeIdentityTemplate().Select(x => x.ID().GetText());
                        return identityTemplates.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
                    }
                    isValid(context) {
                        return !DuplicateIdentityTemplates(context).Any();
                    }
                    getFailureMessage(context) {
                        var identifier = context.extendeeName().GetText();
                        var duplicateIdentityTemplates = DuplicateIdentityTemplates(context);
                        return string.Format("Interchange additions '{0}' declares duplicate identity template{2} '{1}'.", identifier, string.Join("', '", duplicateIdentityTemplates), duplicateIdentityTemplates.Count() > 1 ? "s" : string.Empty);
                    }
                }
                InterchangeExtension.InterchangeExtensionMustNotDuplicateIdentityTemplateName = InterchangeExtensionMustNotDuplicateIdentityTemplateName;
            })(InterchangeExtension = Validator.InterchangeExtension || (Validator.InterchangeExtension = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=InterchangeExtensionMustNotDuplicateIdentityTemplateName.js.map