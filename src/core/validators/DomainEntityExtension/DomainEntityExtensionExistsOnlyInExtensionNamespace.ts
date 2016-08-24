import { ValidationRuleBase } from "../ValidationRuleBase";
export class DomainEntityExtensionExistsOnlyInExtensionNamespace extends ValidationRuleBase<MetaEdGrammar.DomainEntityExtensionContext>
{
    public isValid(context: MetaEdGrammar.DomainEntityExtensionContext): boolean {
        var namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
        return namespaceInfo.IsExtension;
    }
    public getFailureMessage(context: MetaEdGrammar.DomainEntityExtensionContext): string {
        var namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
        return string.Format("Domain Entity additions '{0}' is not valid in core namespace '{1}'.", context.extendeeName().GetText(), namespaceInfo.NamespaceName);
    }
}
