using;
System.Linq;
using;
MetaEd.Grammar.Antlr;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var AssociationSubclass;
            (function (AssociationSubclass) {
                class AssociationSubclassMustNotDuplicateAssociationPropertyName {
                }
                ValidationRuleBase < MetaEdGrammar.AssociationSubclassContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        AssociationSubclassMustNotDuplicateAssociationPropertyName(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, AssociationSubclassContext = context) {
                            var entityType = context.ASSOCIATION().GetText();
                            var extensionType = context.ASSOCIATION().GetText() + context.BASED_ON();
                            var identifier = context.associationName().GetText();
                            var baseIdentifier = context.baseName().GetText();
                            // compare on symbol table identifiers
                            var basePropertyIdentifiers = _symbolTable.IdentifiersForEntityProperties(entityType, baseIdentifier);
                            var subclassPropertyIdentifiers = _symbolTable.IdentifiersForEntityProperties(extensionType, identifier);
                            return !basePropertyIdentifiers.Intersect(subclassPropertyIdentifiers).Any();
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, AssociationSubclassContext = context) {
                            var entityType = context.ASSOCIATION().GetText();
                            var extensionType = context.ASSOCIATION().GetText() + context.BASED_ON();
                            var identifier = context.associationName().GetText();
                            var baseIdentifier = context.baseName().GetText();
                            // get real names for error message
                            var associationPropertyIdentifiers = _symbolTable.IdentifiersForEntityProperties(entityType, baseIdentifier).ToList();
                            var propertyRuleContextsForDuplicates = _symbolTable.ContextsForMatchingPropertyIdentifiers(extensionType, identifier, associationPropertyIdentifiers);
                            var duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates.Select(x => x.IdNode().GetText());
                            return string.Format("Association '{0}' based on '{1}' declares '{2}' already in property list of base Association.", identifier, baseIdentifier, string.Join(",", duplicatePropertyIdentifierList));
                        }
                    };
            })(AssociationSubclass = Validator.AssociationSubclass || (Validator.AssociationSubclass = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=AssociationSubclassMustNotDuplicateAssociationPropertyName.js.map