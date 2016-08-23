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
            var DomainEntitySubclass;
            (function (DomainEntitySubclass) {
                class DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName {
                }
                ValidationRuleBase < MetaEdGrammar.DomainEntitySubclassContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, DomainEntitySubclassContext = context) {
                            var entityType = context.DOMAIN_ENTITY().GetText();
                            var extensionType = context.DOMAIN_ENTITY().GetText() + context.BASED_ON();
                            var identifier = context.entityName().GetText();
                            var baseIdentifier = context.baseName().GetText();
                            // compare on symbol table identifiers
                            var basePropertyIdentifiers = _symbolTable.IdentifiersForEntityProperties(entityType, baseIdentifier);
                            var subclassPropertyIdentifiers = _symbolTable.IdentifiersForEntityProperties(extensionType, identifier);
                            return !basePropertyIdentifiers.Intersect(subclassPropertyIdentifiers).Any();
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, DomainEntitySubclassContext = context) {
                            var domainEntityType = context.DOMAIN_ENTITY().GetText();
                            var extensionType = context.DOMAIN_ENTITY().GetText() + context.BASED_ON();
                            var identifier = context.entityName().GetText();
                            var baseIdentifier = context.baseName().GetText();
                            // get real names for error message
                            var associationPropertyIdentifiers = _symbolTable.IdentifiersForEntityProperties(domainEntityType, baseIdentifier).ToList();
                            var propertyRuleContextsForDuplicates = _symbolTable.ContextsForMatchingPropertyIdentifiers(extensionType, identifier, associationPropertyIdentifiers);
                            var duplicatePropertyIdentifierList = propertyRuleContextsForDuplicates.Select(x => x.IdNode().GetText());
                            return string.Format("DomainEntity '{0}' based on '{1}' declares '{2}' already in property list of base DomainEntity.", identifier, baseIdentifier, string.Join(",", duplicatePropertyIdentifierList));
                        }
                    };
            })(DomainEntitySubclass = Validator.DomainEntitySubclass || (Validator.DomainEntitySubclass = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName.js.map