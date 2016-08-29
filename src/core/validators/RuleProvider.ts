import {IValidationRule} from "./IValidationRule";
import {ISymbolTable} from "./SymbolTable";

export interface IRuleProvider {
    getAll(ruleIndex : number, symbolTable: ISymbolTable) : IValidationRule[];
}