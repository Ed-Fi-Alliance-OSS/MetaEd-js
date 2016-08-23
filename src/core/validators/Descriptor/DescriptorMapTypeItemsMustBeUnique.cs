using System.Linq;
using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.Descriptor
{
    public class DescriptorMapTypeItemsMustBeUnique : ValidationRuleBase<MetaEdGrammar.DescriptorContext>
    {
        private static string[] DuplicateShortDescriptions(MetaEdGrammar.DescriptorContext context)
        {
            // short descriptions are on the optional map type
            if (context.withMapType() == null) return new string[0];

            var shortDescriptions = context.withMapType().enumerationItem().Select(x => x.shortDescription().GetText());

            //group and filter duplicates
            return shortDescriptions.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
        }

        public override bool IsValid(MetaEdGrammar.DescriptorContext context)
        {
            return !DuplicateShortDescriptions(context).Any();
        }

        public override string GetFailureMessage(MetaEdGrammar.DescriptorContext context)
        {
            var identifier = context.descriptorName().GetText();
            var duplicateShortDescriptions = DuplicateShortDescriptions(context);

            return string.Format("Descriptor '{0}' declares duplicate item{2} '{1}'.", identifier, string.Join("', '", duplicateShortDescriptions), duplicateShortDescriptions.Count() > 1 ? "s" : string.Empty);
        }
    }
}
