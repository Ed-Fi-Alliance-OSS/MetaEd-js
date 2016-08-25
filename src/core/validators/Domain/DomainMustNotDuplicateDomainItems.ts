import { ValidationRuleBase } from "../ValidationRuleBase";
export class DomainMustNotDuplicateDomainItems extends ValidationRuleBase<MetaEdGrammar.DomainContext>
{
    private static getDuplicateDomainItems(context: MetaEdGrammar.DomainContext): string[] {
        var domainItemNames = context.domainItem().Select(x => x.IdText());
        return domainItemNames.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
    }
    public isValid(context: MetaEdGrammar.DomainContext): boolean {
        return DomainMustNotDuplicateDomainItems.getDuplicateDomainItems(context).length == 0
    }
    public getFailureMessage(context: MetaEdGrammar.DomainContext): string {
        var identifier = context.EntityName();
        var duplicateDomainItems = DomainMustNotDuplicateDomainItems.getDuplicateDomainItems(context);
        return `Domain '${identifier}' declares duplicate domain item${duplicateDomainItems.length > 1 ? "s" : ""} '${duplicateDomainItems.join(', ')}'.`;
    }
}
