import { ValidationRuleBase } from "../ValidationRuleBase";
export class MergePartOfReferenceExistsOnlyInCoreNamespace extends ValidationRuleBase<MetaEdGrammar.MergePartOfReferenceContext>
{
    public isValid(context: MetaEdGrammar.MergePartOfReferenceContext): boolean {
        let namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
        return !namespaceInfo.IsExtension;
    }
    public getFailureMessage(context: MetaEdGrammar.MergePartOfReferenceContext): string {
        let namespaceInfo = context.GetAncestorContext<INamespaceInfo>();
        let topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
        let propertyWithComponents = context.GetAncestorContext<IPropertyWithComponents>();
        return `'merge' is invalid for property ${propertyWithComponents.IdNode().getText()} on ${topLevelEntity.EntityIdentifier()} '${topLevelEntity.EntityName()}' in extension namespace ${namespaceInfo.NamespaceName}.  'merge' is only valid for properties on types in a core namespace.`
    }
}
