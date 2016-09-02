import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
import SymbolTableEntityType from '../SymbolTableEntityType'
let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;

export class AssociationExtensionIdentifierMustMatchAnAssociationOrAssociationSubclass extends ValidationRuleBase
{
    private symbolTable: ISymbolTable;
    private symbolTableEntityType: SymbolTableEntityType = new SymbolTableEntityType();
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }

    public handlesContext(context: any) : boolean {
        return context.ruleIndex === MetaEdGrammar.RULE_associationExtension;
    }

    public isValid(context: any): boolean {
        let identifierToMatch = context.extendeeName().getText();
        return this.symbolTable.identifierExists(this.symbolTableEntityType.associationEntityType(), identifierToMatch) 
        || this.symbolTable.identifierExists(this.symbolTableEntityType.associationSubclassEntityType(), identifierToMatch);
    }

    public getFailureMessage(context: any): string {
        return `Association additions '${context.extendeeName().getText()}' does not match any declared Association or subclass.`;
    }
}
