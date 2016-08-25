"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class CommonTypeExtensionMustNotDuplicateCommonTypePropertyName extends ValidationRuleBase_1.ValidationRuleBase {
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
        let joinedString = duplicatePropertyIdentifierList.join(',');
        return `Common Type additions '${identifier}' declares '${joinedString}' already in property list of Common Type.`;
    }
}
exports.CommonTypeExtensionMustNotDuplicateCommonTypePropertyName = CommonTypeExtensionMustNotDuplicateCommonTypePropertyName;
//# sourceMappingURL=CommonTypeExtensionMustNotDuplicateCommonTypePropertyName.js.map