using MetaEd.Grammar.Antlr;
using MetaEd.Grammar.Antlr.Extensions;

namespace MetaEd.Core.Validator.InlineCommonType
{
    public class InlineCommonTypeExistsOnlyInCoreNamespace : ValidationRuleBase<MetaEdGrammar.InlineCommonTypeContext>
    {
        public override bool IsValid(MetaEdGrammar.InlineCommonTypeContext context)
        {
            var namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
            return !namespaceInfo.IsExtension;
        }

        public override string GetFailureMessage(MetaEdGrammar.InlineCommonTypeContext context)
        {
            var namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
            return string.Format("Inline Common Type '{0}' is not valid in extension namespace '{1}'.", context.EntityName(), namespaceInfo.NamespaceName);
        }
    }
}
