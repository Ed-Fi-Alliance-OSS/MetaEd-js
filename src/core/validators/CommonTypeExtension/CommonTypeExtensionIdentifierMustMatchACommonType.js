var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var CommonTypeExtension;
            (function (CommonTypeExtension) {
                class CommonTypeExtensionIdentifierMustMatchACommonType extends ValidationRuleBase {
                    constructor(symbolTable) {
                        this._symbolTable = symbolTable;
                    }
                    isValid(context) {
                        var entityType = context.COMMON_TYPE().GetText();
                        var identifier = context.extendeeName().GetText();
                        return this._symbolTable.IdentifiersForEntityType(entityType).Any(x => x.Equals(identifier));
                    }
                    getFailureMessage(context) {
                        return string.Format("Common Type additions '{0}' does not match any declared Common Type.", context.extendeeName().GetText());
                    }
                }
                CommonTypeExtension.CommonTypeExtensionIdentifierMustMatchACommonType = CommonTypeExtensionIdentifierMustMatchACommonType;
            })(CommonTypeExtension = Validator.CommonTypeExtension || (Validator.CommonTypeExtension = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=CommonTypeExtensionIdentifierMustMatchACommonType.js.map