"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class AssociationSubclassMustNotDuplicateAssociationPropertyName extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        let entityType = context.ASSOCIATION().GetText();
        let extensionType = context.ASSOCIATION().GetText() + context.BASED_ON();
        let identifier = context.associationName().GetText();
        let baseIdentifier = context.baseName().GetText();
        let basePropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(entityType, baseIdentifier);
        let subclassPropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(extensionType, identifier);
        return !basePropertyIdentifiers.Intersect(subclassPropertyIdentifiers).Any();
    }
    getFailureMessage(context) {
        let entityType = context.ASSOCIATION().GetText();
        let extensionType = context.ASSOCIATION().GetText() + context.BASED_ON();
        let identifier = context.associationName().GetText();
        let baseIdentifier = context.baseName().GetText();
        let associationPropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(entityType, baseIdentifier).ToList();
        let propertyRuleContextsForDuplicates = this.symbolTable.contextsForMatchingPropertyIdentifiers(extensionType, identifier, associationPropertyIdentifiers);
        let duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates.Select(x => x.IdNode().GetText());
        return `Association '${identifier}' based on '${baseIdentifier}' declares '${duplicatePropertyIdentifierList.join(',')}' already in property list of base Association.`;
    }
}
exports.AssociationSubclassMustNotDuplicateAssociationPropertyName = AssociationSubclassMustNotDuplicateAssociationPropertyName;
//# sourceMappingURL=AssociationSubclassMustNotDuplicateAssociationPropertyName.js.map