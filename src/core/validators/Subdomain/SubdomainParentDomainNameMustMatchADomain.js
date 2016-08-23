using;
MetaEd.Grammar.Antlr;
var MetaEd;
(function (MetaEd) {
    var Core;
    (function (Core) {
        var Validator;
        (function (Validator) {
            var Subdomain;
            (function (Subdomain) {
                class SubdomainParentDomainNameMustMatchADomain {
                }
                ValidationRuleBase < MetaEdGrammar.SubdomainContext >
                    {
                        readonly: ISymbolTable, _symbolTable: ,
                        SubdomainParentDomainNameMustMatchADomain(ISymbolTable = symbolTable) {
                            _symbolTable = symbolTable;
                        },
                        override: bool, IsValid(MetaEdGrammar, SubdomainContext = context) {
                            var parentDomainName = context.parentDomainName().IdText();
                            var domainType = MetaEdGrammar.TokenName(MetaEdGrammar.DOMAIN);
                            return _symbolTable.IdentifierExists(domainType, parentDomainName);
                        },
                        override: string, GetFailureMessage(MetaEdGrammar, SubdomainContext = context) {
                            return string.Format("Subdomain '{0}' is part of '{1}' which does not match any declared domain.", context.EntityName(), context.parentDomainName().IdText());
                        }
                    };
            })(Subdomain = Validator.Subdomain || (Validator.Subdomain = {}));
        })(Validator = Core.Validator || (Core.Validator = {}));
    })(Core = MetaEd.Core || (MetaEd.Core = {}));
})(MetaEd || (MetaEd = {}));
//# sourceMappingURL=SubdomainParentDomainNameMustMatchADomain.js.map