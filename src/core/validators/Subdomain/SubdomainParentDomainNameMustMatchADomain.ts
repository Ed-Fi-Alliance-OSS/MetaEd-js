import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class SubdomainParentDomainNameMustMatchADomain extends ValidationRuleBase<MetaEdGrammar.SubdomainContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.SubdomainContext): boolean {
        let parentDomainName = context.parentDomainName().IdText();
        let domainType = MetaEdGrammar.TokenName(MetaEdGrammar.DOMAIN);
        return this.symbolTable.identifierExists(domainType, parentDomainName);
    }
    public getFailureMessage(context: MetaEdGrammar.SubdomainContext): string {
        return `Subdomain '${context.EntityName()}' is part of '${context.parentDomainName().IdText()}' which does not match any declared domain.`;
    }
}
