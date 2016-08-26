import { ValidationRuleBase } from "../ValidationRuleBase";
export class EnumerationItemsMustBeUnique extends ValidationRuleBase<MetaEdGrammar.EnumerationContext>
{
    private static duplicateShortDescriptions(context: MetaEdGrammar.EnumerationContext): string[] {
        let shortDescriptions = context.enumerationItem().Select(x => x.shortDescription().GetText());
        return shortDescriptions.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
    }
    public isValid(context: MetaEdGrammar.EnumerationContext): boolean {
        return EnumerationItemsMustBeUnique.duplicateShortDescriptions(context).length==0;
    }
    public getFailureMessage(context: MetaEdGrammar.EnumerationContext): string {
        let identifier = context.enumerationName().GetText();
        let duplicateShortDescriptions = EnumerationItemsMustBeUnique.duplicateShortDescriptions(context);
        return `Enumeration '${identifier}' declares duplicate item${duplicateShortDescriptions.length > 1 ? "s" : ""} '${duplicateShortDescriptions.join(', ')}'.`;
    }
}
