"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class DomainMustNotDuplicateDomainItems extends ValidationRuleBase_1.ValidationRuleBase {
    static getDuplicateDomainItems(context) {
        var domainItemNames = context.domainItem().Select(x => x.IdText());
        return domainItemNames.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
    }
    isValid(context) {
        return DomainMustNotDuplicateDomainItems.getDuplicateDomainItems(context).length == 0;
    }
    getFailureMessage(context) {
        var identifier = context.EntityName();
        var duplicateDomainItems = DomainMustNotDuplicateDomainItems.getDuplicateDomainItems(context);
        return `Domain '${identifier}' declares duplicate domain item${duplicateDomainItems.length > 1 ? "s" : ""} '${duplicateDomainItems.join(', ')}'.`;
    }
}
exports.DomainMustNotDuplicateDomainItems = DomainMustNotDuplicateDomainItems;
//# sourceMappingURL=DomainMustNotDuplicateDomainItems.js.map