/// <reference path="../../../src/grammar/gen/MetaEdGrammar.d.ts" />

import {IValidationRule} from "./IValidationRule";
import ParserRuleContext = MetaEdGrammar.ParserRuleContext;
import {ISymbolTable} from "./SymbolTable";

export interface IRuleProvider
{
    getAll<TContext extends ParserRuleContext>(symbolTable: ISymbolTable) : IValidationRule<TContext>[];
}