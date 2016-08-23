using MetaEd.Grammar.Antlr;
using MetaEd.Grammar.Antlr.Extensions;

namespace MetaEd.Core.Validator.MergePartOfReference
{
    public class MergePartOfReferenceExistsOnlyInCoreNamespace : ValidationRuleBase<MetaEdGrammar.MergePartOfReferenceContext>
    {
        public override bool IsValid(MetaEdGrammar.MergePartOfReferenceContext context)
        {
            var namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
            return !namespaceInfo.IsExtension;
        }

        public override string GetFailureMessage(MetaEdGrammar.MergePartOfReferenceContext context)
        {
            var namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            var propertyWithComponents = context.GetAncestorContext<IPropertyWithComponents>();
            return
                string.Format(
                    "'merge' is invalid for property {0} on {1} '{2}' in extension namespace {3}.  'merge' is only valid for properties on types in a core namespace.",
                    propertyWithComponents.IdNode().GetText(),
                    topLevelEntity.EntityIdentifier(),
                    topLevelEntity.EntityName(),
                    namespaceInfo.NamespaceName);
        }
    }
}
