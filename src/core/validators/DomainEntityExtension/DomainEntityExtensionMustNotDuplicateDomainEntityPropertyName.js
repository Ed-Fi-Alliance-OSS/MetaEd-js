"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        return this.propertyRuleContextsForDuplicates(context).length == 0;
    }
    getFailureMessage(context) {
        let duplicatePropertyIdentifierList = this.propertyRuleContextsForDuplicates(context).Select(x => x.IdNode().GetText());
        return `Domain Entity additions '${context.extendeeName().GetText()}' declares '${duplicatePropertyIdentifierList.join(', ')}' already in property list of Domain Entity.`;
    }
    propertyRuleContextsForDuplicates(context) {
        let entityType = context.DOMAIN_ENTITY().GetText();
        let extensionType = context.DOMAIN_ENTITY().GetText() + context.ADDITIONS();
        let identifier = context.extendeeName().GetText();
        let domainEntityPropertyIdentifiers = this.symbolTable.identifiersForEntityProperties(entityType, identifier).ToList();
        let duplicates = this.symbolTable.contextsForMatchingPropertyIdentifiers(extensionType, identifier, domainEntityPropertyIdentifiers);
        return duplicates.Where(isNotIncludePropertyContextWithExtension);
    }
    static isNotIncludePropertyContextWithExtension(context) {
        if (!(context instanceof MetaEdGrammar.IncludePropertyContext))
            return true;
        return context.includeExtensionOverride() == null;
    }
}
exports.DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName = DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName;
//# sourceMappingURL=DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName.js.map