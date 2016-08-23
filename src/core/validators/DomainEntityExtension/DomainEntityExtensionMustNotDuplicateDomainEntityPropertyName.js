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
            var DomainEntityExtension;
            (function (DomainEntityExtension) {
                class DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName {
                }
                ValidationRuleBase < MetaEdGrammar.DomainEntityExtensionContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, DomainEntityExtensionContext = context) {
                            return !PropertyRuleContextsForDuplicates(context).Any();
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, DomainEntityExtensionContext = context) {
                            var duplicatePropertyIdentifierList = PropertyRuleContextsForDuplicates(context).Select(x => x.IdNode().GetText());
                            return string.Format("Domain Entity additions '{0}' declares '{1}' already in property list of Domain Entity.", context.extendeeName().GetText(), string.Join(",", duplicatePropertyIdentifierList));
                        },
                        // takes into account that include extensions are not considered duplicates
                        IEnumerable() { }, PropertyRuleContextsForDuplicates(MetaEdGrammar, DomainEntityExtensionContext = context) {
                            var entityType = context.DOMAIN_ENTITY().GetText();
                            var extensionType = context.DOMAIN_ENTITY().GetText() + context.ADDITIONS();
                            var identifier = context.extendeeName().GetText();
                            var domainEntityPropertyIdentifiers = _symbolTable.IdentifiersForEntityProperties(entityType, identifier).ToList();
                            var duplicates = _symbolTable.ContextsForMatchingPropertyIdentifiers(extensionType, identifier, domainEntityPropertyIdentifiers);
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
            })(DomainEntityExtension = Validator.DomainEntityExtension || (Validator.DomainEntityExtension = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName.js.map