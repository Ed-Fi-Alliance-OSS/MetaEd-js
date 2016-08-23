module MetaEd.Core.Validator.Subdomain {
    export class SubdomainMustNotDuplicateDomainItems extends ValidationRuleBase<MetaEdGrammar.SubdomainContext>
    {
        private static getDuplicateDomainItems(context: MetaEdGrammar.SubdomainContext): string[] {
            var domainItemNames = context.domainItem().Select(x => x.IdText());
            return domainItemNames.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
        }
        public isValid(context: MetaEdGrammar.SubdomainContext): boolean {
            return !GetDuplicateDomainItems(context).Any();
        }
        public getFailureMessage(context: MetaEdGrammar.SubdomainContext): string {
            var identifier = context.EntityName();
            var duplicateDomainItems = GetDuplicateDomainItems(context);
            return string.Format("Subdomain '{0}' declares duplicate domain item{2} '{1}'.", identifier, string.Join("', '", duplicateDomainItems), duplicateDomainItems.Count() > 1 ? "s" : string.Empty);
        }
    }
}