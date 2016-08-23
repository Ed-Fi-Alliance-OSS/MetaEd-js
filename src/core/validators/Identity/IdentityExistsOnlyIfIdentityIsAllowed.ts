import { ValidationRuleBase } from "../ValidationRuleBase";
    export class IdentityExistsOnlyIfIdentityIsAllowed extends ValidationRuleBase<MetaEdGrammar.IdentityContext>
    {
        private _validIdentityRuleIndices: number[] = [MetaEdGrammar.RULE_abstractEntity,
            MetaEdGrammar.RULE_association,
            MetaEdGrammar.RULE_commonType,
            MetaEdGrammar.RULE_domainEntity,
            MetaEdGrammar.RULE_inlineCommonType];
        private _validIdentityTokenNames: string[] = [MetaEdGrammar.TokenName(MetaEdGrammar.ABSTRACT_ENTITY),
            MetaEdGrammar.TokenName(MetaEdGrammar.ASSOCIATION),
            MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_TYPE),
            MetaEdGrammar.TokenName(MetaEdGrammar.DOMAIN_ENTITY),
            MetaEdGrammar.TokenName(MetaEdGrammar.INLINE_COMMON_TYPE)];
        public isValid(context: MetaEdGrammar.IdentityContext): boolean {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            return this._validIdentityRuleIndices.Contains(topLevelEntity.RuleIndex);
        }
        public getFailureMessage(context: MetaEdGrammar.IdentityContext): string {
            var topLevelEntity = context.GetAncestorContext<ITopLevelEntity>();
            var propertyWithComponents = context.GetAncestorContext<IPropertyWithComponents>();
            var validNames = string.Join(", ", this._validIdentityTokenNames);
            return string.Format("'is part of identity' is invalid for property {0} on {1} '{2}'.  'is part of identity' is only valid for properties on types: {3}.",
                propertyWithComponents.IdNode().GetText(),
                topLevelEntity.EntityIdentifier(),
                topLevelEntity.EntityName(),
                validNames);
        }
    }
}