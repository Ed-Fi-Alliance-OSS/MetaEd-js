import { ValidationRuleBase } from "../ValidationRuleBase";
export class MergePartOfReferenceExistsOnlyInCoreNamespace extends ValidationRuleBase<MetaEdGrammar.MergePartOfReferenceContext>
{
    public isValid(context: MetaEdGrammar.MergePartOfReferenceContext): boolean {
        var namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
        return !namespaceInfo.IsExtension;
    }
    public getFailureMessage(context: MetaEdGrammar.MergePartOfReferenceContext): string {
        var namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
        var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
        var propertyWithComponents = context.GetAncestorContext<IPropertyWithComponents>();
        return `'merge' is invalid for property ${propertyWithComponents.IdNode().GetText()} on ${topLevelEntity.EntityIdentifier()} '${topLevelEntity.EntityName()}' in extension namespace ${namespaceInfo.NamespaceName}.  'merge' is only valid for properties on types in a core namespace.`
    }
}
