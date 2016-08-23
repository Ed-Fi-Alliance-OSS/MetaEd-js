var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var AssociationSubclass;
            (function (AssociationSubclass) {
                class AssociationSubclassMustNotDuplicateAssociationPropertyName extends ValidationRuleBase {
                    constructor(symbolTable) {
                        this._symbolTable = symbolTable;
                    }
                    isValid(context) {
                        var entityType = context.ASSOCIATION().GetText();
                        var extensionType = context.ASSOCIATION().GetText() + context.BASED_ON();
                        var identifier = context.associationName().GetText();
                        var baseIdentifier = context.baseName().GetText();
                        var basePropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(entityType, baseIdentifier);
                        var subclassPropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(extensionType, identifier);
                        return !basePropertyIdentifiers.Intersect(subclassPropertyIdentifiers).Any();
                    }
                    getFailureMessage(context) {
                        var entityType = context.ASSOCIATION().GetText();
                        var extensionType = context.ASSOCIATION().GetText() + context.BASED_ON();
                        var identifier = context.associationName().GetText();
                        var baseIdentifier = context.baseName().GetText();
                        var associationPropertyIdentifiers = this._symbolTable.IdentifiersForEntityProperties(entityType, baseIdentifier).ToList();
                        var propertyRuleContextsForDuplicates = this._symbolTable.ContextsForMatchingPropertyIdentifiers(extensionType, identifier, associationPropertyIdentifiers);
                        var duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates.Select(x => x.IdNode().GetText());
                        return string.Format("Association '{0}' based on '{1}' declares '{2}' already in property list of base Association.", identifier, baseIdentifier, string.Join(",", duplicatePropertyIdentifierList));
                    }
                }
                AssociationSubclass.AssociationSubclassMustNotDuplicateAssociationPropertyName = AssociationSubclassMustNotDuplicateAssociationPropertyName;
            })(AssociationSubclass = Validator.AssociationSubclass || (Validator.AssociationSubclass = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=AssociationSubclassMustNotDuplicateAssociationPropertyName.js.map