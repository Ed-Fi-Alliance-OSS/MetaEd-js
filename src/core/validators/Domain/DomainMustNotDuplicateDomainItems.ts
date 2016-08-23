import { ValidationRuleBase } from "../ValidationRuleBase";
    export class DomainMustNotDuplicateDomainItems extends ValidationRuleBase<MetaEdGrammar.DomainContext>
    {
        private static getDuplicateDomainItems(context: MetaEdGrammar.DomainContext): string[] {
            var domainItemNames = context.domainItem().Select(x => x.IdText());
            return domainItemNames.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
        }
        public isValid(context: MetaEdGrammar.DomainContext): boolean {
            return !GetDuplicateDomainItems(context).Any();
        }
        public getFailureMessage(context: MetaEdGrammar.DomainContext): string {
            var identifier = context.EntityName();
            var duplicateDomainItems = GetDuplicateDomainItems(context);
            return string.Format("Domain '{0}' declares duplicate domain item{2} '{1}'.", identifier, string.Join("', '", duplicateDomainItems), duplicateDomainItems.Count() > 1 ? "s" : string.Empty);
        }
    }
}