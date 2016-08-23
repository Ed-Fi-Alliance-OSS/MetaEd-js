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
            var Enumeration;
            (function (Enumeration) {
                class EnumerationItemsMustBeUnique {
                }
                ValidationRuleBase < MetaEdGrammar.EnumerationContext >
                    {
                        string: [], DuplicateShortDescriptions(MetaEdGrammar, EnumerationContext = context) {
                            var shortDescriptions = context.enumerationItem().Select(x => x.shortDescription().GetText());
                            //group and filter duplicates
                            return shortDescriptions.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
                        },
                        override: bool, IsValid(MetaEdGrammar, EnumerationContext = context) {
                            return !DuplicateShortDescriptions(context).Any();
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, EnumerationContext = context) {
                            var identifier = context.enumerationName().GetText();
                            var duplicateShortDescriptions = DuplicateShortDescriptions(context);
                            return string.Format("Enumeration '{0}' declares duplicate item{2} '{1}'.", identifier, string.Join("', '", duplicateShortDescriptions), duplicateShortDescriptions.Count() > 1 ? "s" : string.Empty);
                        }
                    };
            })(Enumeration = Validator.Enumeration || (Validator.Enumeration = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=EnumerationItemsMustBeUnique.js.map