module MetaEd.Core.Validator.IdentityRename {
    export class IdentityRenameExistsOnlyIfIdentityRenameIsAllowed extends ValidationRuleBase<MetaEdGrammar.IdentityRenameContext>
    {
        private _validIdentityRenameParentRuleIndices: number[] = [MetaEdGrammar.RULE_domainEntitySubclass,
            MetaEdGrammar.RULE_associationSubclass];
        public isValid(context: MetaEdGrammar.IdentityRenameContext): boolean {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return this._validIdentityRenameParentRuleIndices.Contains(topLevelEntity.RuleIndex);
        }
        public getFailureMessage(context: MetaEdGrammar.IdentityRenameContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            var propertyWithComponents = context.GetAncestorContext<IPropertyWithComponents>();
            return string.Format("'renames identity property' is invalid for property {0} on {1} '{2}'.  'renames identity property' is only valid for properties on types Domain Entity subclass and Association subclass.",
                propertyWithComponents.IdNode().GetText(),
                topLevelEntity.EntityIdentifier(),
                topLevelEntity.EntityName());
        }
    }
}