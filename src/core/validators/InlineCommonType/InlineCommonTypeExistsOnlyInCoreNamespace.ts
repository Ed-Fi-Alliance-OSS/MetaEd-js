import { ValidationRuleBase } from "../ValidationRuleBase";
export class InlineCommonTypeExistsOnlyInCoreNamespace extends ValidationRuleBase<MetaEdGrammar.InlineCommonTypeContext>
{
    public isValid(context: MetaEdGrammar.InlineCommonTypeContext): boolean {
        var namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
        return !namespaceInfo.IsExtension;
    }
    public getFailureMessage(context: MetaEdGrammar.InlineCommonTypeContext): string {
        var namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
        return `Inline Common Type '${ context.EntityName()}' is not valid in extension namespace '${namespaceInfo.NamespaceName}'.", );
    }
}
