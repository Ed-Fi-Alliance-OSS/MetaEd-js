"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class DescriptorMapTypeItemsMustBeUnique extends ValidationRuleBase_1.ValidationRuleBase {
    static duplicateShortDescriptions(context) {
        if (context.withMapType() == null)
            return new Array(0);
        var shortDescriptions = context.withMapType().enumerationItem().Select(x => x.shortDescription().GetText());
        return shortDescriptions.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
    }
    isValid(context) {
        return !DuplicateShortDescriptions(context).Any();
    }
    getFailureMessage(context) {
        var identifier = context.descriptorName().GetText();
        var duplicateShortDescriptions = DuplicateShortDescriptions(context);
        return string.Format("Descriptor '{0}' declares duplicate item{2} '{1}'.", identifier, string.Join("', '", duplicateShortDescriptions), duplicateShortDescriptions.Count() > 1 ? "s" : string.Empty);
    }
}
exports.DescriptorMapTypeItemsMustBeUnique = DescriptorMapTypeItemsMustBeUnique;
//# sourceMappingURL=DescriptorMapTypeItemsMustBeUnique.js.map