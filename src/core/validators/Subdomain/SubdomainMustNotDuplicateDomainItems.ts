import { ValidationRuleBase } from "../ValidationRuleBase";

export class SubdomainMustNotDuplicateDomainItems extends ValidationRuleBase<MetaEdGrammar.SubdomainContext>
{
    private static getDuplicateDomainItems(context: MetaEdGrammar.SubdomainContext): string[] {
        var domainItemNames = context.domainItem().Select(x => x.IdText());
        return domainItemNames.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
    }
    public isValid(context: MetaEdGrammar.SubdomainContext): boolean {
        return SubdomainMustNotDuplicateDomainItems.getDuplicateDomainItems(context).length == 0;
    }
    public getFailureMessage(context: MetaEdGrammar.SubdomainContext): string {
        var identifier = context.EntityName();
        var duplicateDomainItems = SubdomainMustNotDuplicateDomainItems.getDuplicateDomainItems(context);
        return `Subdomain '${identifier}' declares duplicate domain item${duplicateDomainItems.length > 1 ? "s" : ""} '${duplicateDomainItems.join(', ')}'.`;
    }
}
