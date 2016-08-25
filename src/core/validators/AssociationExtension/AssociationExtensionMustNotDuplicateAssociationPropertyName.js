"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class AssociationExtensionMustNotDuplicateAssociationPropertyName extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    isValid(context) {
        return !PropertyRuleContextsForDuplicates(context).Any();
    }
    getFailureMessage(context) {
        var duplicatePropertyIdentifierList = PropertyRuleContextsForDuplicates(context).Select(x => x.IdNode().GetText());
        return `Association additions '${context.extendeeName().GetText()}' declares '${string.Join(",", duplicatePropertyIdentifierList)}' already in property list of Association.`;
    }
    propertyRuleContextsForDuplicates(context) {
        var entityType = context.ASSOCIATION().GetText();
        var extensionType = context.ASSOCIATION().GetText() + context.ADDITIONS();
        var identifier = context.extendeeName().GetText();
        var associationPropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(entityType, identifier).ToList();
        var duplicates = this._symbolTable.ContextsForMatchingPropertyIdentifiers(extensionType, identifier, associationPropertyIdentifiers);
        return duplicates.Where(IsNotIncludePropertyContextWithExtension);
    }
    static isNotIncludePropertyContextWithExtension(context) {
        if (!(context instanceof MetaEdGrammar.IncludePropertyContext))
            return true;
        return context.includeExtensionOverride() == null;
    }
}
exports.AssociationExtensionMustNotDuplicateAssociationPropertyName = AssociationExtensionMustNotDuplicateAssociationPropertyName;
//# sourceMappingURL=AssociationExtensionMustNotDuplicateAssociationPropertyName.js.map