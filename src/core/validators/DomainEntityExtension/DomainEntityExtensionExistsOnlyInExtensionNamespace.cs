using MetaEd.Grammar.Antlr;
using MetaEd.Grammar.Antlr.Extensions;

namespace MetaEd.Core.Validator.DomainEntityExtension
{
    public class DomainEntityExtensionExistsOnlyInExtensionNamespace : ValidationRuleBase<MetaEdGrammar.DomainEntityExtensionContext>
    {
        public override bool IsValid(MetaEdGrammar.DomainEntityExtensionContext context)
        {
            var namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
            return namespaceInfo.IsExtension;
        }

        public override string GetFailureMessage(MetaEdGrammar.DomainEntityExtensionContext context)
        {
            var namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
            return string.Format("Domain Entity additions '{0}' is not valid in core namespace '{1}'.", context.extendeeName().GetText(), namespaceInfo.NamespaceName);
        }
    }
}
