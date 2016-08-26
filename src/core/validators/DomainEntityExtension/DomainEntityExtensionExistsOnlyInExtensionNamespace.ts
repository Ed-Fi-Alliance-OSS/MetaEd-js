import { ValidationRuleBase } from "../ValidationRuleBase";
export class DomainEntityExtensionExistsOnlyInExtensionNamespace extends ValidationRuleBase<MetaEdGrammar.DomainEntityExtensionContext>
{
    public isValid(context: MetaEdGrammar.DomainEntityExtensionContext): boolean {
        let namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
        return namespaceInfo.IsExtension;
    }
    public getFailureMessage(context: MetaEdGrammar.DomainEntityExtensionContext): string {
        let namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
        return `Domain Entity additions '${context.extendeeName().GetText()}' is not valid in core namespace '${namespaceInfo.NamespaceName}`;
    }
}
