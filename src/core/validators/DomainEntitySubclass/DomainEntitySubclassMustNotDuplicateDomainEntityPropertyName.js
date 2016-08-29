"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        let entityType = context.DOMAIN_ENTITY().GetText();
        let extensionType = context.DOMAIN_ENTITY().GetText() + context.BASED_ON();
        let identifier = context.entityName().GetText();
        let baseIdentifier = context.baseName().GetText();
        let basePropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(entityType, baseIdentifier);
        let subclassPropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(extensionType, identifier);
        return !basePropertyIdentifiers.Intersect(subclassPropertyIdentifiers).Any();
    }
    getFailureMessage(context) {
        let domainEntityType = context.DOMAIN_ENTITY().GetText();
        let extensionType = context.DOMAIN_ENTITY().GetText() + context.BASED_ON();
        let identifier = context.entityName().GetText();
        let baseIdentifier = context.baseName().GetText();
        let associationPropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(domainEntityType, baseIdentifier).ToList();
        let propertyRuleContextsForDuplicates = this.symbolTable.contextsForMatchingPropertyIdentifiers(extensionType, identifier, associationPropertyIdentifiers);
        let duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates.Select(x => x.IdNode().GetText());
        return `DomainEntity '${identifier}' based on '${baseIdentifier}' declares '${duplicatePropertyIdentifierList.join(", ")}' already in property list of base DomainEntity.`;
    }
}
exports.DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName = DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName;
//# sourceMappingURL=DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName.js.map