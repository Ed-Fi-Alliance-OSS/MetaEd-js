import { ValidationRuleBase } from "../ValidationRuleBase";
    export class InterchangeElementMustMatchADomainEntityOrAssociationOrSubclass extends ValidationRuleBase<MetaEdGrammar.InterchangeElementContext>
    {
        private _symbolTable: ISymbolTable;
        constructor(symbolTable: ISymbolTable) {
            this._symbolTable = symbolTable;
        }
        public isValid(context: MetaEdGrammar.InterchangeElementContext): boolean {
            var identifierToMatch = context.IdText();
            return this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntityEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.DomainEntitySubclassEntityType(), identifierToMatch);
        }
        public getFailureMessage(context: MetaEdGrammar.InterchangeElementContext): string {
            return string.Format("Interchange element '{0}' does not match any declared domain entity or subclass, association or subclass.", context.IdText());
        }
    }
}