import { ValidationRuleBase } from "../ValidationRuleBase";
    export class DescriptorPropertyMustMatchADescriptor extends ValidationRuleBase<MetaEdGrammar.DescriptorPropertyContext>
    {
        private _symbolTable: ISymbolTable;
        constructor(symbolTable: ISymbolTable) {
            this._symbolTable = symbolTable;
        }
        public isValid(context: MetaEdGrammar.DescriptorPropertyContext): boolean {
            var identifierToMatch = context.propertyName().GetText();
            var descriptorType = MetaEdGrammar.TokenName(MetaEdGrammar.DESCRIPTOR_ENTITY);
            return this._symbolTable.IdentifierExists(descriptorType, identifierToMatch);
        }
        public getFailureMessage(context: MetaEdGrammar.DescriptorPropertyContext): string {
            return string.Format("Descriptor property '{0}' does not match any declared descriptor.", context.propertyName().GetText());
        }
    }
}