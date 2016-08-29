import {ValidationRuleBase} from "../ValidationRuleBase";
let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;

export class AssociationMustNotDuplicateDomainEntityNames extends ValidationRuleBase
{
    public handlesContext(context: any) : boolean {
        return context.ruleIndex === MetaEdGrammar.RULE_association;
    }

    public isValid(context: any): boolean {
        let firstDomainEntityName = context.firstDomainEntity().propertyName().ID().getText();
        let secondDomainEntityName = context.secondDomainEntity().propertyName().ID().getText();
        if (firstDomainEntityName !== secondDomainEntityName)
            return true;
        let firstContext = context.firstDomainEntity().withContext();
        let secondContext = context.secondDomainEntity().withContext();
        let firstContextName = firstContext == null ? "" : firstContext.withContextName().ID().getText();
        let secondContextName = secondContext == null ? "" : secondContext.withContextName().ID().getText();
        return firstContextName !== secondContextName;
    }

    public getFailureMessage(context: any): string {
        let identifier = context.associationName().getText();
        let firstDomainEntityName = context.firstDomainEntity().propertyName().ID().getText();
        return `Association '${identifier}' has duplicate declarations of Domain Entity '${firstDomainEntityName}'`;
    }
}
