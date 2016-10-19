"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class SubdomainMustNotDuplicateDomainItems extends ValidationRuleBase_1.ValidationRuleBase {
    static getDuplicateDomainItems(context) {
        let domainItemNames = context.domainItem().Select(x => x.IdText());
        return domainItemNames.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
    }
    isValid(context) {
        return SubdomainMustNotDuplicateDomainItems.getDuplicateDomainItems(context).length == 0;
    }
    getFailureMessage(context) {
        let identifier = context.EntityName();
        let duplicateDomainItems = SubdomainMustNotDuplicateDomainItems.getDuplicateDomainItems(context);
        return `Subdomain '${identifier}' declares duplicate domain item${duplicateDomainItems.length > 1 ? "s" : ""} '${duplicateDomainItems.join(', ')}'.`;
    }
}
exports.SubdomainMustNotDuplicateDomainItems = SubdomainMustNotDuplicateDomainItems;
//# sourceMappingURL=SubdomainMustNotDuplicateDomainItems.js.map