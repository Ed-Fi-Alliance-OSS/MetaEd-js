import { ValidationRuleBase } from "../ValidationRuleBase";
    export class SubdomainParentDomainNameMustMatchADomain extends ValidationRuleBase<MetaEdGrammar.SubdomainContext>
    {
        private _symbolTable: ISymbolTable;
        constructor(symbolTable: ISymbolTable) {
            this._symbolTable = symbolTable;
        }
        public isValid(context: MetaEdGrammar.SubdomainContext): boolean {
            var parentDomainName = context.parentDomainName().IdText();
            var domainType = MetaEdGrammar.TokenName(MetaEdGrammar.DOMAIN);
            return this._symbolTable.IdentifierExists(domainType, parentDomainName);
        }
        public getFailureMessage(context: MetaEdGrammar.SubdomainContext): string {
            return string.Format("Subdomain '{0}' is part of '{1}' which does not match any declared domain.", context.EntityName(), context.parentDomainName().IdText());
        }
    }
