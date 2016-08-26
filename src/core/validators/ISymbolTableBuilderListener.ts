import {IMetaEdContext} from '../tasks/MetaEdContext';
import ParserRuleContext = MetaEdGrammar.ParserRuleContext;

export declare type ITerminalNode = any;

export interface ISymbolTableBuilderListener
{
    withContext(context: IMetaEdContext): void;
    /// <summary>
    /// A callback to be invoked before the AddEntity operation of the SymbolTableBuilder
    /// </summary>
    /// <returns>true if the AddEntity operation can proceed</returns>
    beforeAddEntity(entityType: string, entityName: ITerminalNode, context: ParserRuleContext): boolean;
}