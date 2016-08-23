using MetaEd.Grammar.Antlr;

namespace MetaEd.Core.Validator.Subdomain
{
    public class SubdomainParentDomainNameMustMatchADomain : ValidationRuleBase<MetaEdGrammar.SubdomainContext>
    {
        private readonly ISymbolTable _symbolTable;

        public SubdomainParentDomainNameMustMatchADomain(ISymbolTable symbolTable)
        {
            _symbolTable = symbolTable;
        }

        public override bool IsValid(MetaEdGrammar.SubdomainContext context)
        {
            var parentDomainName = context.parentDomainName().IdText();

            var domainType = MetaEdGrammar.TokenName(MetaEdGrammar.DOMAIN);

            return _symbolTable.IdentifierExists(domainType, parentDomainName);
        }

        public override string GetFailureMessage(MetaEdGrammar.SubdomainContext context)
        {
            return string.Format("Subdomain '{0}' is part of '{1}' which does not match any declared domain.", context.EntityName(), context.parentDomainName().IdText());
        }
    }
}
