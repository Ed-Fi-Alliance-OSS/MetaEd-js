var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var DomainEntityExtension;
            (function (DomainEntityExtension) {
                class DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName extends ValidationRuleBase {
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
                DomainEntityExtension.DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName = DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName;
            })(DomainEntityExtension = Validator.DomainEntityExtension || (Validator.DomainEntityExtension = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName.js.map