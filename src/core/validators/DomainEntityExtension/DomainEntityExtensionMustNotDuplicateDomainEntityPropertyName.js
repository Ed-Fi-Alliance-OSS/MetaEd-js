"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    isValid(context) {
        return !PropertyRuleContextsForDuplicates(context).Any();
    }
    getFailureMessage(context) {
        var duplicatePropertyIdentifierList = PropertyRuleContextsForDuplicates(context).Select(x => x.IdNode().GetText());
        return string.Format("Domain Entity additions '{0}' declares '{1}' already in property list of Domain Entity.", context.extendeeName().GetText(), string.Join(",", duplicatePropertyIdentifierList));
    }
    propertyRuleContextsForDuplicates(context) {
        var entityType = context.DOMAIN_ENTITY().GetText();
        var extensionType = context.DOMAIN_ENTITY().GetText() + context.ADDITIONS();
        var identifier = context.extendeeName().GetText();
        var domainEntityPropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(entityType, identifier).ToList();
        var duplicates = this._symbolTable.ContextsForMatchingPropertyIdentifiers(extensionType, identifier, domainEntityPropertyIdentifiers);
        return duplicates.Where(IsNotIncludePropertyContextWithExtension);
    }
    static isNotIncludePropertyContextWithExtension(context) {
        if (!(context instanceof MetaEdGrammar.IncludePropertyContext))
            return true;
        return context.includeExtensionOverride() == null;
    }
}
exports.DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName = DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName;
//# sourceMappingURL=DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName.js.map