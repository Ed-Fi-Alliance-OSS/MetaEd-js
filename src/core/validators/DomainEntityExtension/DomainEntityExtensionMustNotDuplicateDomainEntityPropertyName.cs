using System.Collections.Generic;
using System.Linq;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.DomainEntityExtension
{
    public class DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName : ValidationRuleBase<MetaEdGrammar.DomainEntityExtensionContext>
    {
        private readonly ISymbolTable _symbolTable;

        public DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.DomainEntityExtensionContext context)
        {
            return !PropertyRuleContextsForDuplicates(context).Any();
        }

        public override string GetFailureMessage(MetaEdGrammar.DomainEntityExtensionContext context)
        {
            var duplicatePropertyIdentifierList = PropertyRuleContextsForDuplicates(context).Select(x => x.IdNode().GetText());
            return string.Format("Domain Entity additions '{0}' declares '{1}' already in property list of Domain Entity.", context.extendeeName().GetText(), string.Join(",", duplicatePropertyIdentifierList));
        }

        // takes into account that include extensions are not considered duplicates
        protected IEnumerable<IPropertyWithComponents> PropertyRuleContextsForDuplicates(MetaEdGrammar.DomainEntityExtensionContext context)
        {
            var entityType = context.DOMAIN_ENTITY().GetText();
            var extensionType = context.DOMAIN_ENTITY().GetText() + context.ADDITIONS();
            var identifier = context.extendeeName().GetText();

            var domainEntityPropertyIdentifiers = _symbolTable.IdentifiersForEntityProperties(entityType, identifier).ToList();
            var duplicates = _symbolTable.ContextsForMatchingPropertyIdentifiers(extensionType, identifier, domainEntityPropertyIdentifiers);
            return duplicates.Where(IsNotIncludePropertyContextWithExtension);
        }

        private static bool IsNotIncludePropertyContextWithExtension(IPropertyWithComponents context)
        {
            if (!(context is MetaEdGrammar.IncludePropertyContext)) return true;
            return ((MetaEdGrammar.IncludePropertyContext)context).includeExtensionOverride() == null;
        }
    }
}
