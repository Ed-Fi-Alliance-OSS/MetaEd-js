var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var DomainEntitySubclass;
            (function (DomainEntitySubclass) {
                class DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName extends ValidationRuleBase {
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
                        return string.Format("DomainEntity '{0}' based on '{1}' declares '{2}' already in property list of base DomainEntity.", identifier, baseIdentifier, string.Join(",", duplicatePropertyIdentifierList));
                    }
                }
                DomainEntitySubclass.DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName = DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName;
            })(DomainEntitySubclass = Validator.DomainEntitySubclass || (Validator.DomainEntitySubclass = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName.js.map