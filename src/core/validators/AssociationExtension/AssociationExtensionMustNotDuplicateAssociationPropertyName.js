var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var AssociationExtension;
            (function (AssociationExtension) {
                class AssociationExtensionMustNotDuplicateAssociationPropertyName extends ValidationRuleBase {
                    constructor(symbolTable) {
                        this._symbolTable = symbolTable;
                    }
                    isValid(context) {
                        return !PropertyRuleContextsForDuplicates(context).Any();
                    }
                    getFailureMessage(context) {
                        var duplicatePropertyIdentifierList = PropertyRuleContextsForDuplicates(context).Select(x => x.IdNode().GetText());
                        return string.Format("Association additions '{0}' declares '{1}' already in property list of Association.", context.extendeeName().GetText(), string.Join(",", duplicatePropertyIdentifierList));
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
                AssociationExtension.AssociationExtensionMustNotDuplicateAssociationPropertyName = AssociationExtensionMustNotDuplicateAssociationPropertyName;
            })(AssociationExtension = Validator.AssociationExtension || (Validator.AssociationExtension = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=AssociationExtensionMustNotDuplicateAssociationPropertyName.js.map