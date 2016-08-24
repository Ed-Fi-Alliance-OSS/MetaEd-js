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
        return string.Format("'merge' is invalid for property {0} on {1} '{2}' in extension namespace {3}.  'merge' is only valid for properties on types in a core namespace.",
            propertyWithComponents.IdNode().GetText(),
            topLevelEntity.EntityIdentifier(),
            topLevelEntity.EntityName(),
            namespaceInfo.NamespaceName);
    }
}
