import { ValidationRuleBase } from "../ValidationRuleBase";
    export class EnumerationItemsMustBeUnique extends ValidationRuleBase<MetaEdGrammar.EnumerationContext>
    {
        private static duplicateShortDescriptions(context: MetaEdGrammar.EnumerationContext): string[] {
            var shortDescriptions = context.enumerationItem().Select(x => x.shortDescription().GetText());
            return shortDescriptions.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
        }
        public isValid(context: MetaEdGrammar.EnumerationContext): boolean {
            return !DuplicateShortDescriptions(context).Any();
        }
        public getFailureMessage(context: MetaEdGrammar.EnumerationContext): string {
            var identifier = context.enumerationName().GetText();
            var duplicateShortDescriptions = DuplicateShortDescriptions(context);
            return string.Format("Enumeration '{0}' declares duplicate item{2} '{1}'.", identifier, string.Join("', '", duplicateShortDescriptions), duplicateShortDescriptions.Count() > 1 ? "s" : string.Empty);
        }
    }
}