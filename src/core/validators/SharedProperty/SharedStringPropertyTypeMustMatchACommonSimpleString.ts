import { ValidationRuleBase } from "../ValidationRuleBase";
    export class SharedStringPropertyTypeMustMatchACommonSimpleString extends ValidationRuleBase<MetaEdGrammar.SharedStringPropertyContext>
    {
        private _symbolTable: ISymbolTable;
        constructor(symbolTable: ISymbolTable) {
            this._symbolTable = symbolTable;
        }
        public isValid(context: MetaEdGrammar.SharedStringPropertyContext): boolean {
            var identifierToMatch = context.sharedPropertyType().GetText();
            var commonStringType = MetaEdGrammar.TokenName(MetaEdGrammar.COMMON_STRING);
            return this._symbolTable.IdentifierExists(commonStringType, identifierToMatch);
        }
        public getFailureMessage(context: MetaEdGrammar.SharedStringPropertyContext): string {
            return string.Format("Shared property '{0}' does not match any declared common string.", context.propertyName().GetText());
        }
    }
