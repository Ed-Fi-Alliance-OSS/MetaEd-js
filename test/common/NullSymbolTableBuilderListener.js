import { IMetaEdContext } from '../../src/core/tasks/MetaEdContext'
//import { ISymbolTableBuilderListener } from '../../src/core/validators/ISymbolTableBuilderListener'

declare type TerminalNode = any;

export default class NullSymbolTableBuilderListener /* implements ISymbolTableBuilderListener */ {
    withContext(context: IMetaEdContext): void {
    }
    beforeAddEntity(entityType: string, entityName: TerminalNode, context: any): boolean {
        return true;
    }
}