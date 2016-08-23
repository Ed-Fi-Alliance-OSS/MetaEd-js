var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var InterchangeExtension;
            (function (InterchangeExtension) {
                class InterchangeExtensionMustNotDuplicateInterchangeElementName extends ValidationRuleBase {
                    constructor(symbolTable) {
                        this._symbolTable = symbolTable;
                    }
                    static duplicateInterchangeElements(context) {
                        var interchangeElements = context.interchangeExtensionComponent().interchangeElement().Select(x => x.ID().GetText());
                        return interchangeElements.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
                    }
                    isValid(context) {
                        return !DuplicateInterchangeElements(context).Any();
                    }
                    getFailureMessage(context) {
                        var identifier = context.extendeeName().GetText();
                        var duplicateInterchangeElements = DuplicateInterchangeElements(context);
                        return string.Format("Interchange additions '{0}' declares duplicate interchange element{2} '{1}'.", identifier, string.Join("', '", duplicateInterchangeElements), duplicateInterchangeElements.Count() > 1 ? "s" : string.Empty);
                    }
                }
                InterchangeExtension.InterchangeExtensionMustNotDuplicateInterchangeElementName = InterchangeExtensionMustNotDuplicateInterchangeElementName;
            })(InterchangeExtension = Validator.InterchangeExtension || (Validator.InterchangeExtension = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=InterchangeExtensionMustNotDuplicateInterchangeElementName.js.map