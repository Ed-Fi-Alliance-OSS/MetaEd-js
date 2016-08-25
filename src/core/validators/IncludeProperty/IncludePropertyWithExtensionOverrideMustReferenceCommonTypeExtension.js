"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension extends ValidationRuleBase_1.ValidationRuleBase {
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
exports.IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension = IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension;
//# sourceMappingURL=IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension.js.map