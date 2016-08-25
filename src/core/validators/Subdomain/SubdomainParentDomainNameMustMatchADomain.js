"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class SubdomainParentDomainNameMustMatchADomain extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        this._symbolTable = symbolTable;
    }
    isValid(context) {
        var parentDomainName = context.parentDomainName().IdText();
        var domainType = MetaEdGrammar.TokenName(MetaEdGrammar.DOMAIN);
        return this._symbolTable.IdentifierExists(domainType, parentDomainName);
    }
    getFailureMessage(context) {
        return string.Format("Subdomain '{0}' is part of '{1}' which does not match any declared domain.", context.EntityName(), context.parentDomainName().IdText());
    }
}
exports.SubdomainParentDomainNameMustMatchADomain = SubdomainParentDomainNameMustMatchADomain;
//# sourceMappingURL=SubdomainParentDomainNameMustMatchADomain.js.map