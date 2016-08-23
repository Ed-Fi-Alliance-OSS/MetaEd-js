using;
System.Collections.Generic;
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
            var AssociationExtension;
            (function (AssociationExtension) {
                class AssociationExtensionMustNotDuplicateAssociationPropertyName {
                }
                ValidationRuleBase < MetaEdGrammar.AssociationExtensionContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        AssociationExtensionMustNotDuplicateAssociationPropertyName(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, AssociationExtensionContext = context) {
                            return !PropertyRuleContextsForDuplicates(context).Any();
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, AssociationExtensionContext = context) {
                            var duplicatePropertyIdentifierList = PropertyRuleContextsForDuplicates(context).Select(x => x.IdNode().GetText());
                            return string.Format("Association additions '{0}' declares '{1}' already in property list of Association.", context.extendeeName().GetText(), string.Join(",", duplicatePropertyIdentifierList));
                        },
                        // takes into account that include extensions are not considered duplicates
                        IEnumerable() { }, PropertyRuleContextsForDuplicates(MetaEdGrammar, AssociationExtensionContext = context) {
                            var entityType = context.ASSOCIATION().GetText();
                            var extensionType = context.ASSOCIATION().GetText() + context.ADDITIONS();
                            var identifier = context.extendeeName().GetText();
                            var associationPropertyIdentifiers = _symbolTable.IdentifiersForEntityProperties(entityType, identifier).ToList();
                            var duplicates = _symbolTable.ContextsForMatchingPropertyIdentifiers(extensionType, identifier, associationPropertyIdentifiers);
                            return duplicates.Where(IsNotIncludePropertyContextWithExtension);
                        },
                        bool: IsNotIncludePropertyContextWithExtension(IPropertyWithComponents, context) };
                {
                    if (!(context))
                        is;
                    MetaEdGrammar.IncludePropertyContext;
                    return true;
                    return ((MetaEdGrammar.IncludePropertyContext));
                    context;
                    includeExtensionOverride() == null;
                }
            })(AssociationExtension = Validator.AssociationExtension || (Validator.AssociationExtension = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=AssociationExtensionMustNotDuplicateAssociationPropertyName.js.map