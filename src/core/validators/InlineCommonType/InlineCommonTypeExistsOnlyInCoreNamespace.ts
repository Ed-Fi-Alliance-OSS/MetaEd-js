module MetaEd.Core.Validator.InlineCommonType {
    export class InlineCommonTypeExistsOnlyInCoreNamespace extends ValidationRuleBase<MetaEdGrammar.InlineCommonTypeContext>
    {
        public isValid(context: MetaEdGrammar.InlineCommonTypeContext): boolean {
            var namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
            return !namespaceInfo.IsExtension;
        }
        public getFailureMessage(context: MetaEdGrammar.InlineCommonTypeContext): string {
            var namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
            return string.Format("Inline Common Type '{0}' is not valid in extension namespace '{1}'.", context.EntityName(), namespaceInfo.NamespaceName);
        }
    }
}