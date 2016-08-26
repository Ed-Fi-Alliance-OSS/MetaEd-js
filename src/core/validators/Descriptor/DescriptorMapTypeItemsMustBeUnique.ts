import { ValidationRuleBase } from "../ValidationRuleBase";
export class DescriptorMapTypeItemsMustBeUnique extends ValidationRuleBase<MetaEdGrammar.DescriptorContext>
{
    private static duplicateShortDescriptions(context: MetaEdGrammar.DescriptorContext): string[] {
        if (context.withMapType() == null)
            return new Array(0);
        let shortDescriptions = context.withMapType().enumerationItem().Select(x => x.shortDescription().GetText());
        return shortDescriptions.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
    }
    public isValid(context: MetaEdGrammar.DescriptorContext): boolean {
        return DescriptorMapTypeItemsMustBeUnique.duplicateShortDescriptions(context).length == 0;
    }
    public getFailureMessage(context: MetaEdGrammar.DescriptorContext): string {
        let identifier = context.descriptorName().GetText();
        let duplicateShortDescriptions = DescriptorMapTypeItemsMustBeUnique.duplicateShortDescriptions(context);
        return `Descriptor '${identifier}' declares duplicate item${duplicateShortDescriptions.length > 1 ? "s" : ""} '${duplicateShortDescriptions.join(', ')}'.`;
    }
}
