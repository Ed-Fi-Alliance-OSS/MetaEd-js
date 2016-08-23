var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var CommonTypeExtension;
            (function (CommonTypeExtension) {
                class CommonTypeExtensionMustNotDuplicateCommonTypePropertyName extends ValidationRuleBase {
                    constructor(symbolTable) {
                        this._symbolTable = symbolTable;
                    }
                    isValid(context) {
                        var entityType = context.COMMON_TYPE().GetText();
                        var extensionType = context.COMMON_TYPE().GetText() + context.ADDITIONS();
                        var identifier = context.extendeeName().GetText();
                        var commonTypePropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(entityType, identifier);
                        var extensionPropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(extensionType, identifier);
                        return !commonTypePropertyIdentifiers.Intersect(extensionPropertyIdentifiers).Any();
                    }
                    getFailureMessage(context) {
                        var entityType = context.COMMON_TYPE().GetText();
                        var extensionType = context.COMMON_TYPE().GetText() + context.ADDITIONS();
                        var identifier = context.extendeeName().GetText();
                        var commonTypePropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(entityType, identifier).ToList();
                        var propertyRuleContextsForDuplicates = this._symbolTable.ContextsForMatchingPropertyIdentifiers(extensionType, identifier, commonTypePropertyIdentifiers);
                        var duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates.Select(x => x.IdNode().GetText());
                        return string.Format("Common Type additions '{0}' declares '{1}' already in property list of Common Type.", identifier, string.Join(",", duplicatePropertyIdentifierList));
                    }
                }
                CommonTypeExtension.CommonTypeExtensionMustNotDuplicateCommonTypePropertyName = CommonTypeExtensionMustNotDuplicateCommonTypePropertyName;
            })(CommonTypeExtension = Validator.CommonTypeExtension || (Validator.CommonTypeExtension = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=CommonTypeExtensionMustNotDuplicateCommonTypePropertyName.js.map