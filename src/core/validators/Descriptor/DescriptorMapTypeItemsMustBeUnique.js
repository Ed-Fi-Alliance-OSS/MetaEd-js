"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class DescriptorMapTypeItemsMustBeUnique extends ValidationRuleBase_1.ValidationRuleBase {
    static duplicateShortDescriptions(context) {
        if (context.withMapType() == null)
            return new Array(0);
        let shortDescriptions = context.withMapType().enumerationItem().Select(x => x.shortDescription().GetText());
        return shortDescriptions.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
    }
    isValid(context) {
        return DescriptorMapTypeItemsMustBeUnique.duplicateShortDescriptions(context).length == 0;
    }
    getFailureMessage(context) {
        let identifier = context.descriptorName().GetText();
        let duplicateShortDescriptions = DescriptorMapTypeItemsMustBeUnique.duplicateShortDescriptions(context);
        return `Descriptor '${identifier}' declares duplicate item${duplicateShortDescriptions.length > 1 ? "s" : ""} '${duplicateShortDescriptions.join(', ')}'.`;
    }
}
exports.DescriptorMapTypeItemsMustBeUnique = DescriptorMapTypeItemsMustBeUnique;
//# sourceMappingURL=DescriptorMapTypeItemsMustBeUnique.js.map