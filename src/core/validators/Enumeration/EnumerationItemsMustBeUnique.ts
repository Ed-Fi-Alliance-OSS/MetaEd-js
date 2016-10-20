import { ValidationRuleBase } from "../ValidationRuleBase";
export class EnumerationItemsMustBeUnique extends ValidationRuleBase<MetaEdGrammar.EnumerationContext>
{
    private static duplicateShortDescriptions(context: MetaEdGrammar.EnumerationContext): string[] {
        let shortDescriptions = context.enumerationItem().map(x => x.shortDescription().getText());
        return shortDescriptions.GroupBy(x => x).filter(group => group.Count() > 1).map(group => group.Key).ToArray();
    }
    public isValid(context: MetaEdGrammar.EnumerationContext): boolean {
        return EnumerationItemsMustBeUnique.duplicateShortDescriptions(context).length==0;
    }
    public getFailureMessage(context: MetaEdGrammar.EnumerationContext): string {
        let identifier = context.enumerationName().getText();
        let duplicateShortDescriptions = EnumerationItemsMustBeUnique.duplicateShortDescriptions(context);
        return `Enumeration '${identifier}' declares duplicate item${duplicateShortDescriptions.length > 1 ? "s" : ""} '${duplicateShortDescriptions.join(', ')}'.`;
    }
}
