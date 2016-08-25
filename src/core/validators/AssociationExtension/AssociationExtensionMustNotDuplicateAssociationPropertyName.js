"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class AssociationExtensionMustNotDuplicateAssociationPropertyName extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    isValid(context) {
        return this.propertyRuleContextsForDuplicates(context).length == 0;
    }
    getFailureMessage(context) {
        var duplicatePropertyIdentifierList = this.propertyRuleContextsForDuplicates(context).Select(x => x.IdNode().GetText());
        return `Association additions '${context.extendeeName().GetText()}' declares '${duplicatePropertyIdentifierList.join(',')}' already in property list of Association.`;
    }
    propertyRuleContextsForDuplicates(context) {
        var entityType = context.ASSOCIATION().GetText();
        var extensionType = context.ASSOCIATION().GetText() + context.ADDITIONS();
        var identifier = context.extendeeName().GetText();
        var associationPropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(entityType, identifier).ToList();
        var duplicates = this._symbolTable.ContextsForMatchingPropertyIdentifiers(extensionType, identifier, associationPropertyIdentifiers);
        return duplicates.Where(AssociationExtensionMustNotDuplicateAssociationPropertyName.isNotIncludePropertyContextWithExtension);
    }
    static isNotIncludePropertyContextWithExtension(context) {
        if (!(context instanceof MetaEdGrammar.IncludePropertyContext))
            return true;
        return context.includeExtensionOverride() == null;
    }
}
exports.AssociationExtensionMustNotDuplicateAssociationPropertyName = AssociationExtensionMustNotDuplicateAssociationPropertyName;
//# sourceMappingURL=AssociationExtensionMustNotDuplicateAssociationPropertyName.js.map