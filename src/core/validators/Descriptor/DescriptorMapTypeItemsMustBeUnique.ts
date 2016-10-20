import { ValidationRuleBase } from "../ValidationRuleBase";
export class DescriptorMapTypeItemsMustBeUnique extends ValidationRuleBase<MetaEdGrammar.DescriptorContext>
{
    private static duplicateShortDescriptions(context: MetaEdGrammar.DescriptorContext): string[] {
        if (context.withMapType() == null)
            return new Array(0);
        let shortDescriptions = context.withMapType().enumerationItem().map(x => x.shortDescription().getText());
        return shortDescriptions.GroupBy(x => x).filter(group => group.Count() > 1).map(group => group.Key).ToArray();
    }
    public isValid(context: MetaEdGrammar.DescriptorContext): boolean {
        return DescriptorMapTypeItemsMustBeUnique.duplicateShortDescriptions(context).length == 0;
    }
    public getFailureMessage(context: MetaEdGrammar.DescriptorContext): string {
        let identifier = context.descriptorName().getText();
        let duplicateShortDescriptions = DescriptorMapTypeItemsMustBeUnique.duplicateShortDescriptions(context);
        return `Descriptor '${identifier}' declares duplicate item${duplicateShortDescriptions.length > 1 ? "s" : ""} '${duplicateShortDescriptions.join(', ')}'.`;
    }
}
