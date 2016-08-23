module MetaEd.Core.Validator.AssociationExtension {
    export class AssociationExtensionExistsOnlyInExtensionNamespace extends ValidationRuleBase<MetaEdGrammar.AssociationExtensionContext>
    {
        public isValid(context: MetaEdGrammar.AssociationExtensionContext): boolean {
            var namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
            return namespaceInfo.IsExtension;
        }
        public getFailureMessage(context: MetaEdGrammar.AssociationExtensionContext): string {
            var namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
            return string.Format("Association additions '{0}' is not valid in core namespace '{1}'.", context.extendeeName().GetText(), namespaceInfo.NamespaceName);
        }
    }
}