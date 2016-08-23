using System.Linq;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.Subdomain
{
    public class SubdomainMustNotDuplicateDomainItems : ValidationRuleBase<MetaEdGrammar.SubdomainContext>
    {
        private static string[] GetDuplicateDomainItems(MetaEdGrammar.SubdomainContext context)
        {
            var domainItemNames = context.domainItem().Select(x => x.IdText());

            //group and filter duplicates
            return domainItemNames.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
        }

        public override bool IsValid(MetaEdGrammar.SubdomainContext context)
        {
            return !GetDuplicateDomainItems(context).Any();
        }

        public override string GetFailureMessage(MetaEdGrammar.SubdomainContext context)
        {
            var identifier = context.EntityName();
            var duplicateDomainItems = GetDuplicateDomainItems(context);

            return string.Format("Subdomain '{0}' declares duplicate domain item{2} '{1}'.", identifier, string.Join("', '", duplicateDomainItems), duplicateDomainItems.Count() > 1 ? "s" : string.Empty);
        }
    }
}
