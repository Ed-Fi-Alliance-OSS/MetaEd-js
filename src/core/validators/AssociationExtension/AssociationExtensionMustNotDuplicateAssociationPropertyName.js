"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class AssociationExtensionMustNotDuplicateAssociationPropertyName extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        return this.propertyRuleContextsForDuplicates(context).length == 0;
    }
    getFailureMessage(context) {
        let duplicatePropertyIdentifierList = this.propertyRuleContextsForDuplicates(context).Select(x => x.IdNode().GetText());
        return `Association additions '${context.extendeeName().GetText()}' declares '${duplicatePropertyIdentifierList.join(',')}' already in property list of Association.`;
    }
    propertyRuleContextsForDuplicates(context) {
        let entityType = context.ASSOCIATION().GetText();
        let extensionType = context.ASSOCIATION().GetText() + context.ADDITIONS();
        let identifier = context.extendeeName().GetText();
        let associationPropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(entityType, identifier).toList();
        let duplicates = this.symbolTable.contextsForMatchingPropertyIdentifiers(extensionType, identifier, associationPropertyIdentifiers);
        return duplicates.where(AssociationExtensionMustNotDuplicateAssociationPropertyName.isNotIncludePropertyContextWithExtension);
    }
    static isNotIncludePropertyContextWithExtension(context) {
        if (!(context instanceof MetaEdGrammar.IncludePropertyContext))
            return true;
        return context.includeExtensionOverride() == null;
    }
}
exports.AssociationExtensionMustNotDuplicateAssociationPropertyName = AssociationExtensionMustNotDuplicateAssociationPropertyName;
//# sourceMappingURL=AssociationExtensionMustNotDuplicateAssociationPropertyName.js.map