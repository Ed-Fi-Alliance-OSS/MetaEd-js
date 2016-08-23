var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var Subdomain;
            (function (Subdomain) {
                class SubdomainParentDomainNameMustMatchADomain extends ValidationRuleBase {
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
                Subdomain.SubdomainParentDomainNameMustMatchADomain = SubdomainParentDomainNameMustMatchADomain;
            })(Subdomain = Validator.Subdomain || (Validator.Subdomain = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=SubdomainParentDomainNameMustMatchADomain.js.map