import { IMetaEdContext } from '../../src/core/tasks/MetaEdContext'
import { ISymbolTableBuilderListener } from '../../src/core/validators/ISymbolTableBuilderListener'
import ParserRuleContext = MetaEdGrammar.ParserRuleContext;

declare type TerminalNode = any;

export default class NullSymbolTableBuilderListener implements ISymbolTableBuilderListener {
    public withContext(context: IMetaEdContext): void {
    }
    public beforeAddEntity(entityType: string, entityName: TerminalNode, context: ParserRuleContext): boolean {
        return true;
    }
}