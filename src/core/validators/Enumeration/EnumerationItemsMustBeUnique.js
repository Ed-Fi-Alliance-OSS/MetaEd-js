"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class EnumerationItemsMustBeUnique extends ValidationRuleBase_1.ValidationRuleBase {
    static duplicateShortDescriptions(context) {
        var shortDescriptions = context.enumerationItem().Select(x => x.shortDescription().GetText());
        return shortDescriptions.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
    }
    isValid(context) {
        return !DuplicateShortDescriptions(context).Any();
    }
    getFailureMessage(context) {
        var identifier = context.enumerationName().GetText();
        var duplicateShortDescriptions = DuplicateShortDescriptions(context);
        return string.Format("Enumeration '{0}' declares duplicate item{2} '{1}'.", identifier, string.Join("', '", duplicateShortDescriptions), duplicateShortDescriptions.Count() > 1 ? "s" : string.Empty);
    }
}
exports.EnumerationItemsMustBeUnique = EnumerationItemsMustBeUnique;
//# sourceMappingURL=EnumerationItemsMustBeUnique.js.map