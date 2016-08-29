"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
const SymbolTableEntityType_1 = require('../SymbolTableEntityType');
class IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTableEntityType = new SymbolTableEntityType_1.default();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        if (context.includeExtensionOverride() == null)
            return true;
        let identifierToMatch = context.propertyName().GetText();
        return this.symbolTable.identifierExists(this.symbolTableEntityType.commonTypeExtensionEntityType(), identifierToMatch);
    }
    getFailureMessage(context) {
        let topLevelEntity = context.GetAncestorContext();
        let propertyWithComponents = context.GetAncestorContext();
        return `'include extension' is invalid for property ${propertyWithComponents.IdNode().GetText()} on ${topLevelEntity.EntityIdentifier()} '${topLevelEntity.EntityName()}'.  'include extension' is only valid for referencing common type extensions.`;
    }
}
exports.IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension = IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension;
//# sourceMappingURL=IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension.js.map