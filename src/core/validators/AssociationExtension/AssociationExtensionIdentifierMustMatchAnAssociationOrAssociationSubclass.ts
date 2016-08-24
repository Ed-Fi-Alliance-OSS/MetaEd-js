import { ValidationRuleBase } from "../ValidationRuleBase";
    export class AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass extends ValidationRuleBase<MetaEdGrammar.AssociationExtensionContext>
    {
        private _symbolTable: ISymbolTable;
        constructor(symbolTable: ISymbolTable) {
            this._symbolTable = symbolTable;
        }
        public isValid(context: MetaEdGrammar.AssociationExtensionContext): boolean {
            var identifierToMatch = context.extendeeName().GetText();
            return this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationEntityType(), identifierToMatch) || this._symbolTable.IdentifierExists(SymbolTableEntityType.AssociationSubclassEntityType(), identifierToMatch);
        }
        public getFailureMessage(context: MetaEdGrammar.AssociationExtensionContext): string {
            return string.Format("Association additions '{0}' does not match any declared Association or subclass.", context.extendeeName().GetText());
        }
    }
