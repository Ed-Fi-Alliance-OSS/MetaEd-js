using;
System.Linq;
using;
MetaEd.Grammar.Antlr;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var Descriptor;
            (function (Descriptor) {
                class DescriptorMapTypeItemsMustBeUnique {
                }
                ValidationRuleBase < MetaEdGrammar.DescriptorContext >
                    {
                        string: [], DuplicateShortDescriptions(MetaEdGrammar, DescriptorContext = context) {
                            // short descriptions are on the optional map type
                            if (context.withMapType() == null)
                                return new string[0];
                            var shortDescriptions = context.withMapType().enumerationItem().Select(x => x.shortDescription().GetText());
                            //group and filter duplicates
                            return shortDescriptions.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
                        },
                        override: bool, IsValid(MetaEdGrammar, DescriptorContext = context) {
                            return !DuplicateShortDescriptions(context).Any();
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, DescriptorContext = context) {
                            var identifier = context.descriptorName().GetText();
                            var duplicateShortDescriptions = DuplicateShortDescriptions(context);
                            return string.Format("Descriptor '{0}' declares duplicate item{2} '{1}'.", identifier, string.Join("', '", duplicateShortDescriptions), duplicateShortDescriptions.Count() > 1 ? "s" : string.Empty);
                        }
                    };
            })(Descriptor = Validator.Descriptor || (Validator.Descriptor = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=DescriptorMapTypeItemsMustBeUnique.js.map