using System.Linq;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.Domain
{
    public class DomainMustNotDuplicateDomainItems : ValidationRuleBase<MetaEdGrammar.DomainContext>
    {
        private static string[] GetDuplicateDomainItems(MetaEdGrammar.DomainContext context)
        {
            var domainItemNames = context.domainItem().Select(x => x.IdText());

            //group and filter duplicates
            return domainItemNames.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
        }

        public override bool IsValid(MetaEdGrammar.DomainContext context)
        {
            return !GetDuplicateDomainItems(context).Any();
        }

        public override string GetFailureMessage(MetaEdGrammar.DomainContext context)
        {
            var identifier = context.EntityName();
            var duplicateDomainItems = GetDuplicateDomainItems(context);

            return string.Format("Domain '{0}' declares duplicate domain item{2} '{1}'.", identifier, string.Join("', '", duplicateDomainItems), duplicateDomainItems.Count() > 1 ? "s" : string.Empty);
        }
    }
}
