import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class DescriptorPropertyMustMatchADescriptor extends ValidationRuleBase<MetaEdGrammar.DescriptorPropertyContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    public isValid(context: MetaEdGrammar.DescriptorPropertyContext): boolean {
        let identifierToMatch = context.propertyName().getText();
        let descriptorType = MetaEdGrammar.TokenName(MetaEdGrammar.DESCRIPTOR_ENTITY);
        return this.symbolTable.identifierExists(descriptorType, identifierToMatch);
    }
    public getFailureMessage(context: MetaEdGrammar.DescriptorPropertyContext): string {
        return `Descriptor property '${context.propertyName().getText()}' does not match any declared descriptor.`;
    }
}
