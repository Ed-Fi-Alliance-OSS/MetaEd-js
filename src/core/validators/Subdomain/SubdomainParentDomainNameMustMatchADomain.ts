import { ValidationRuleBase } from "../ValidationRuleBase";
export class SubdomainParentDomainNameMustMatchADomain extends ValidationRuleBase<MetaEdGrammar.SubdomainContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.SubdomainContext): boolean {
        let parentDomainName = context.parentDomainName().IdText();
        let domainType = MetaEdGrammar.TokenName(MetaEdGrammar.DOMAIN);
        return this._symbolTable.IdentifierExists(domainType, parentDomainName);
    }
    public getFailureMessage(context: MetaEdGrammar.SubdomainContext): string {
        return `Subdomain '${context.EntityName()}' is part of '${context.parentDomainName().IdText()}' which does not match any declared domain.`;
    }
}
