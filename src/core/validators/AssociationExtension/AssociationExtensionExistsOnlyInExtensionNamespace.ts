using MetaEd.Grammar.Antlr;
using MetaEd.Grammar.Antlr.Extensions;

namespace MetaEd.Core.Validator.AssociationExtension
{
    public class AssociationExtensionExistsOnlyInExtensionNamespace : ValidationRuleBase<MetaEdGrammar.AssociationExtensionContext>
    {
        public override bool IsValid(MetaEdGrammar.AssociationExtensionContext context)
        {
            var namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
            return namespaceInfo.IsExtension;
        }

        public override string GetFailureMessage(MetaEdGrammar.AssociationExtensionContext context)
        {
            var namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
            return string.Format("Association additions '{0}' is not valid in core namespace '{1}'.", context.extendeeName().GetText(), namespaceInfo.NamespaceName);
        }
    }
}
