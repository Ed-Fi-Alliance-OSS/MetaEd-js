import { ValidationRuleBase } from "../ValidationRuleBase";
export class AssociationExtensionExistsOnlyInExtensionNamespace extends ValidationRuleBase<MetaEdGrammar.AssociationExtensionContext>
{
    public isValid(context: MetaEdGrammar.AssociationExtensionContext): boolean {
        let namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
        return namespaceInfo.IsExtension;
    }
    public getFailureMessage(context: MetaEdGrammar.AssociationExtensionContext): string {
        let namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
        return `Association additions '${context.extendeeName().GetText()}' is not valid in core namespace '${namespaceInfo.NamespaceName}`;
    }
}
