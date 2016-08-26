import { ValidationRuleBase } from "../ValidationRuleBase";
export class AssociationMustNotDuplicateDomainEntityNames extends ValidationRuleBase<MetaEdGrammar.AssociationContext>
{
    public isValid(context: MetaEdGrammar.AssociationContext): boolean {
        let firstDomainEntityName = context.firstDomainEntity().IdText();
        let secondDomainEntityName = context.secondDomainEntity().IdText();
        if (!firstDomainEntityName.Equals(secondDomainEntityName))
            return true;
        let firstContext = context.firstDomainEntity().withContext();
        let secondContext = context.secondDomainEntity().withContext();
        let firstContextName = firstContext == null ? "" : firstContext.withContextName().ID().GetText();
        let secondContextName = secondContext == null ? "" : secondContext.withContextName().ID().GetText();
        return !firstContextName.Equals(secondContextName);
    }
    public getFailureMessage(context: MetaEdGrammar.AssociationContext): string {
        let identifier = context.associationName().GetText();
        let firstDomainEntityName = context.firstDomainEntity().IdText();
        return `Association '${identifier}' has duplicate declarations of Domain Entity '${firstDomainEntityName}'`;
    }
}
