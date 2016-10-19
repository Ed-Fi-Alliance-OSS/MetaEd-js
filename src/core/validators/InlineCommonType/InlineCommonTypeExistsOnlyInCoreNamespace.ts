import { ValidationRuleBase } from "../ValidationRuleBase";
export class InlineCommonTypeExistsOnlyInCoreNamespace extends ValidationRuleBase<MetaEdGrammar.InlineCommonTypeContext>
{
    public isValid(context: MetaEdGrammar.InlineCommonTypeContext): boolean {
        let namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
        return !namespaceInfo.IsExtension;
    }
    public getFailureMessage(context: MetaEdGrammar.InlineCommonTypeContext): string {
        let namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
        return `Inline Common Type '${ context.EntityName()}' is not valid in extension namespace '${namespaceInfo.NamespaceName}'.", );
    }
}
