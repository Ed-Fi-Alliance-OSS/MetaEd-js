"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class EnumerationItemsMustBeUnique extends ValidationRuleBase_1.ValidationRuleBase {
    static duplicateShortDescriptions(context) {
        let shortDescriptions = context.enumerationItem().Select(x => x.shortDescription().GetText());
        return shortDescriptions.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
    }
    isValid(context) {
        return EnumerationItemsMustBeUnique.duplicateShortDescriptions(context).length == 0;
    }
    getFailureMessage(context) {
        let identifier = context.enumerationName().GetText();
        let duplicateShortDescriptions = EnumerationItemsMustBeUnique.duplicateShortDescriptions(context);
        return `Enumeration '${identifier}' declares duplicate item${duplicateShortDescriptions.length > 1 ? "s" : ""} '${duplicateShortDescriptions.join(', ')}'.`;
    }
}
exports.EnumerationItemsMustBeUnique = EnumerationItemsMustBeUnique;
//# sourceMappingURL=EnumerationItemsMustBeUnique.js.map