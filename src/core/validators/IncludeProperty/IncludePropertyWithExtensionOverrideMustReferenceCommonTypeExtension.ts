using MetaEd.Grammar.Antlr;
using MetaEd.Grammar.Antlr.Extensions;

namespace MetaEd.Core.Validator.IncludeProperty
{
    public class IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension : ValidationRuleBase<MetaEdGrammar.IncludePropertyContext>
    {
        private readonly ISymbolTable _symbolTable;

        public IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.IncludePropertyContext context)
        {
            if (context.includeExtensionOverride() == null) return true;

            var identifierToMatch = context.propertyName().GetText();
            return _symbolTable.IdentifierExists(SymbolTableEntityType.CommonTypeExtensionEntityType(), identifierToMatch);
        }

        public override string GetFailureMessage(MetaEdGrammar.IncludePropertyContext context)
        {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            var propertyWithComponents = context.GetAncestorContext<IPropertyWithComponents>();

            return
                string.Format(
                    "'include extension' is invalid for property {0} on {1} '{2}'.  'include extension' is only valid for referencing common type extensions.",
                    propertyWithComponents.IdNode().GetText(),
                    topLevelEntity.EntityIdentifier(),
                    topLevelEntity.EntityName());
        }
    }
}
