import { ValidationRuleBase } from "../ValidationRuleBase";
export class AssociationMustNotDuplicateDomainEntityNames extends ValidationRuleBase<MetaEdGrammar.AssociationContext>
{
    public isValid(context: MetaEdGrammar.AssociationContext): boolean {
        var firstDomainEntityName = context.firstDomainEntity().IdText();
        var secondDomainEntityName = context.secondDomainEntity().IdText();
        if (!firstDomainEntityName.Equals(secondDomainEntityName))
            return true;
        var firstContext = context.firstDomainEntity().withContext();
        var secondContext = context.secondDomainEntity().withContext();
        var firstContextName = firstContext == null ? string.Empty : firstContext.withContextName().ID().GetText();
        var secondContextName = secondContext == null ? string.Empty : secondContext.withContextName().ID().GetText();
        return !firstContextName.Equals(secondContextName);
    }
    public getFailureMessage(context: MetaEdGrammar.AssociationContext): string {
        var identifier = context.associationName().GetText();
        var firstDomainEntityName = context.firstDomainEntity().IdText();
        return string.Format("Association '{0}' has duplicate declarations of Domain Entity '{1}'.", identifier, firstDomainEntityName);
    }
}
