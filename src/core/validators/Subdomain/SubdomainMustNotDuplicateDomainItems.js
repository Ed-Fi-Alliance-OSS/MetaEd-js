"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class SubdomainMustNotDuplicateDomainItems extends ValidationRuleBase_1.ValidationRuleBase {
    static getDuplicateDomainItems(context) {
        var domainItemNames = context.domainItem().Select(x => x.IdText());
        return domainItemNames.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
    }
    isValid(context) {
        return !GetDuplicateDomainItems(context).Any();
    }
    getFailureMessage(context) {
        var identifier = context.EntityName();
        var duplicateDomainItems = GetDuplicateDomainItems(context);
        return string.Format("Subdomain '{0}' declares duplicate domain item{2} '{1}'.", identifier, string.Join("', '", duplicateDomainItems), duplicateDomainItems.Count() > 1 ? "s" : string.Empty);
    }
}
exports.SubdomainMustNotDuplicateDomainItems = SubdomainMustNotDuplicateDomainItems;
//# sourceMappingURL=SubdomainMustNotDuplicateDomainItems.js.map