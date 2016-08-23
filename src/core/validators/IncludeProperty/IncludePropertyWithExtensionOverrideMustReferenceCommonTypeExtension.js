var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var IncludeProperty;
            (function (IncludeProperty) {
                class IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension extends ValidationRuleBase {
                    constructor(symbolTable) {
                        this._symbolTable = symbolTable;
                    }
                    isValid(context) {
                        if (context.includeExtensionOverride() == null)
                            return true;
                        var identifierToMatch = context.propertyName().GetText();
                        return this._symbolTable.IdentifierExists(SymbolTableEntityType.CommonTypeExtensionEntityType(), identifierToMatch);
                    }
                    getFailureMessage(context) {
                        var topLevelEntity = context.GetAncestorContext();
                        var propertyWithComponents = context.GetAncestorContext();
                        return string.Format("'include extension' is invalid for property {0} on {1} '{2}'.  'include extension' is only valid for referencing common type extensions.", propertyWithComponents.IdNode().GetText(), topLevelEntity.EntityIdentifier(), topLevelEntity.EntityName());
                    }
                }
                IncludeProperty.IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension = IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension;
            })(IncludeProperty = Validator.IncludeProperty || (Validator.IncludeProperty = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension.js.map