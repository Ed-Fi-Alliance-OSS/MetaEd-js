"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class SubdomainParentDomainNameMustMatchADomain extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        let parentDomainName = context.parentDomainName().IdText();
        let domainType = MetaEdGrammar.TokenName(MetaEdGrammar.DOMAIN);
        return this.symbolTable.identifierExists(domainType, parentDomainName);
    }
    getFailureMessage(context) {
        return `Subdomain '${context.EntityName()}' is part of '${context.parentDomainName().IdText()}' which does not match any declared domain.`;
    }
}
exports.SubdomainParentDomainNameMustMatchADomain = SubdomainParentDomainNameMustMatchADomain;
//# sourceMappingURL=SubdomainParentDomainNameMustMatchADomain.js.map