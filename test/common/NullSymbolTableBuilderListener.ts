import { IMetaEdContext, MetaEdContext } from '../../src/core/tasks/MetaEdContext'
import { ISymbolTableBuilderListener } from '../../src/core/validators/ISymbolTableBuilderListener'

declare type TerminalNode = any;//require('antlr4/tree/Tree')
declare type ParserRuleContext = any;
//let ParserRuleContext = require('antlr4')

export default class NullSymbolTableBuilderListener implements ISymbolTableBuilderListener {
    public withContext(context: IMetaEdContext): void {
    }
    public beforeAddEntity(entityType: string, entityName: TerminalNode, context: ParserRuleContext): boolean {
        return true;
    }
}