"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class CommonTypeExtensionMustNotDuplicateCommonTypePropertyName extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        let entityType = context.COMMON_TYPE().GetText();
        let extensionType = context.COMMON_TYPE().GetText() + context.ADDITIONS();
        let identifier = context.extendeeName().GetText();
        let commonTypePropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(entityType, identifier);
        let extensionPropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(extensionType, identifier);
        return !commonTypePropertyIdentifiers.Intersect(extensionPropertyIdentifiers).Any();
    }
    getFailureMessage(context) {
        let entityType = context.COMMON_TYPE().GetText();
        let extensionType = context.COMMON_TYPE().GetText() + context.ADDITIONS();
        let identifier = context.extendeeName().GetText();
        let commonTypePropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(entityType, identifier).ToList();
        let propertyRuleContextsForDuplicates = this.symbolTable.contextsForMatchingPropertyIdentifiers(extensionType, identifier, commonTypePropertyIdentifiers);
        let duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates.Select(x => x.IdNode().GetText());
        let joinedString = duplicatePropertyIdentifierList;
        return `Common Type additions '${identifier}' declares '${joinedString}' already in property list of Common Type.`;
    }
}
exports.CommonTypeExtensionMustNotDuplicateCommonTypePropertyName = CommonTypeExtensionMustNotDuplicateCommonTypePropertyName;
//# sourceMappingURL=CommonTypeExtensionMustNotDuplicateCommonTypePropertyName.js.map