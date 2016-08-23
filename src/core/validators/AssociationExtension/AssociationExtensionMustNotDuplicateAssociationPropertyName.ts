using System.Collections.Generic;
using System.Linq;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.AssociationExtension
{
    public class AssociationExtensionMustNotDuplicateAssociationPropertyName : ValidationRuleBase<MetaEdGrammar.AssociationExtensionContext>
    {
        private readonly ISymbolTable _symbolTable;

        public AssociationExtensionMustNotDuplicateAssociationPropertyName(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.AssociationExtensionContext context)
        {
            return !PropertyRuleContextsForDuplicates(context).Any();
        }

        public override string GetFailureMessage(MetaEdGrammar.AssociationExtensionContext context)
        {
            var duplicatePropertyIdentifierList = PropertyRuleContextsForDuplicates(context).Select(x => x.IdNode().GetText());
            return string.Format("Association additions '{0}' declares '{1}' already in property list of Association.", context.extendeeName().GetText(), string.Join(",", duplicatePropertyIdentifierList));
        }

        // takes into account that include extensions are not considered duplicates
        protected IEnumerable<IPropertyWithComponents> PropertyRuleContextsForDuplicates(MetaEdGrammar.AssociationExtensionContext context)
        {
            var entityType = context.ASSOCIATION().GetText();
            var extensionType = context.ASSOCIATION().GetText() + context.ADDITIONS();
            var identifier = context.extendeeName().GetText();

            var associationPropertyIdentifiers = _symbolTable.IdentifiersForEntityProperties(entityType, identifier).ToList();
            var duplicates = _symbolTable.ContextsForMatchingPropertyIdentifiers(extensionType, identifier, associationPropertyIdentifiers);
            return duplicates.Where(IsNotIncludePropertyContextWithExtension);
        }

        private static bool IsNotIncludePropertyContextWithExtension(IPropertyWithComponents context)
        {
            if (!(context is MetaEdGrammar.IncludePropertyContext)) return true;
            return ((MetaEdGrammar.IncludePropertyContext) context).includeExtensionOverride() == null;
        }
    }
}
