using System.Linq;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.Enumeration
{
    public class EnumerationItemsMustBeUnique : ValidationRuleBase<MetaEdGrammar.EnumerationContext>
    {
        private static string[] DuplicateShortDescriptions(MetaEdGrammar.EnumerationContext context)
        {
            var shortDescriptions = context.enumerationItem().Select(x => x.shortDescription().GetText());

            //group and filter duplicates
            return shortDescriptions.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
        }

        public override bool IsValid(MetaEdGrammar.EnumerationContext context)
        {
            return !DuplicateShortDescriptions(context).Any();
        }

        public override string GetFailureMessage(MetaEdGrammar.EnumerationContext context)
        {
            var identifier = context.enumerationName().GetText();
            var duplicateShortDescriptions = DuplicateShortDescriptions(context);

            return string.Format("Enumeration '{0}' declares duplicate item{2} '{1}'.", identifier, string.Join("', '", duplicateShortDescriptions), duplicateShortDescriptions.Count() > 1 ? "s" : string.Empty);
        }
    }
}
