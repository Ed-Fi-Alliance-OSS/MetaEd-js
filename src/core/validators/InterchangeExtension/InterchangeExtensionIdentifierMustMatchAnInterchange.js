var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var InterchangeExtension;
            (function (InterchangeExtension) {
                class InterchangeExtensionIdentifierMustMatchAnInterchange extends ValidationRuleBase {
                    constructor(symbolTable) {
                        this._symbolTable = symbolTable;
                    }
                    isValid(context) {
                        var entityType = context.INTERCHANGE().GetText();
                        var identifier = context.extendeeName().GetText();
                        return this._symbolTable.IdentifiersForEntityType(entityType).Any(x => x.Equals(identifier));
                    }
                    getFailureMessage(context) {
                        return string.Format("Interchange additions '{0}' does not match any declared Interchange.", context.extendeeName().GetText());
                    }
                }
                InterchangeExtension.InterchangeExtensionIdentifierMustMatchAnInterchange = InterchangeExtensionIdentifierMustMatchAnInterchange;
            })(InterchangeExtension = Validator.InterchangeExtension || (Validator.InterchangeExtension = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=InterchangeExtensionIdentifierMustMatchAnInterchange.js.map