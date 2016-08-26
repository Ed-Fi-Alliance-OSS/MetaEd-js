import { ValidationRuleBase } from "../ValidationRuleBase";
export class DescriptorPropertyMustMatchADescriptor extends ValidationRuleBase<MetaEdGrammar.DescriptorPropertyContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.DescriptorPropertyContext): boolean {
        let identifierToMatch = context.propertyName().GetText();
        let descriptorType = MetaEdGrammar.TokenName(MetaEdGrammar.DESCRIPTOR_ENTITY);
        return this._symbolTable.IdentifierExists(descriptorType, identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.DescriptorPropertyContext): string {
        return `Descriptor property '${context.propertyName().GetText()}' does not match any declared descriptor.`;
    }
}
