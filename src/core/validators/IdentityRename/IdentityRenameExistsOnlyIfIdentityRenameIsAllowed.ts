import { ValidationRuleBase } from "../ValidationRuleBase";
export class IdentityRenameExistsOnlyIfIdentityRenameIsAllowed extends ValidationRuleBase<MetaEdGrammar.IdentityRenameContext>
{
    private _validIdentityRenameParentRuleIndices: number[] = [MetaEdGrammar.RULE_domainEntitySubclass,
        MetaEdGrammar.RULE_associationSubclass];
    public isValid(context: MetaEdGrammar.IdentityRenameContext): boolean {
        let topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
        return this._validIdentityRenameParentRuleIndices.Contains(topLevelEntity.RuleIndex);
    }
    public getFailureMessage(context: MetaEdGrammar.IdentityRenameContext): string {
        let topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
        let propertyWithComponents = context.GetAncestorContext<IPropertyWithComponents>();
        return `'renames identity property' is invalid for property ${propertyWithComponents.IdNode().GetText()} on ${topLevelEntity.EntityIdentifier()} '${topLevelEntity.EntityName()}'.  'renames identity property' is only valid for properties on types Domain Entity subclass and Association subclass.`;
    }
}
