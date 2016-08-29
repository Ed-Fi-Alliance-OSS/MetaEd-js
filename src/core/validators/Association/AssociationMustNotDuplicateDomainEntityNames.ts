import {ValidationRuleBase} from "../ValidationRuleBase";
let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;

export class AssociationMustNotDuplicateDomainEntityNames extends ValidationRuleBase
{
    public handlesContext(context: any) : boolean {
        return context.ruleIndex === MetaEdGrammar.RULE_association;
    }

    public isValid(context: any): boolean {
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

    public getFailureMessage(context: any): string {
        let identifier = context.associationName().GetText();
        let firstDomainEntityName = context.firstDomainEntity().IdText();
        return `Association '${identifier}' has duplicate declarations of Domain Entity '${firstDomainEntityName}'`;
    }
}
