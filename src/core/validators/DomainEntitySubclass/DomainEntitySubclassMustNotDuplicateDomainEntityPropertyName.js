"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    isValid(context) {
        var entityType = context.DOMAIN_ENTITY().GetText();
        var extensionType = context.DOMAIN_ENTITY().GetText() + context.BASED_ON();
        var identifier = context.entityName().GetText();
        var baseIdentifier = context.baseName().GetText();
        var basePropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(entityType, baseIdentifier);
        var subclassPropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(extensionType, identifier);
        return !basePropertyIdentifiers.Intersect(subclassPropertyIdentifiers).Any();
    }
    getFailureMessage(context) {
        var domainEntityType = context.DOMAIN_ENTITY().GetText();
        var extensionType = context.DOMAIN_ENTITY().GetText() + context.BASED_ON();
        var identifier = context.entityName().GetText();
        var baseIdentifier = context.baseName().GetText();
        var associationPropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(domainEntityType, baseIdentifier).ToList();
        var propertyRuleContextsForDuplicates = this._symbolTable.ContextsForMatchingPropertyIdentifiers(extensionType, identifier, associationPropertyIdentifiers);
        var duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates.Select(x => x.IdNode().GetText());
        return `DomainEntity '${identifier}' based on '${baseIdentifier}' declares '${duplicatePropertyIdentifierList.join(", ")}' already in property list of base DomainEntity.`;
    }
}
exports.DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName = DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName;
//# sourceMappingURL=DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName.js.map