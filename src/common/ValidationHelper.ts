import {MetaEdGrammarInstance} from '../grammar/MetaEdGrammarInstance';

export default class ValidationHelper {
    public static getAncestorContext(context: any, ruleIndex: number) {
        let ancestor = this.getAncestorContextNullable(context, ruleIndex);
        if (ancestor === null) {
            const grammarInstance = MetaEdGrammarInstance.instance;
            throw new Error(`Unable to find matching Ancestor {grammarInstance.ruleNames[ruleIndex]} on context of type {grammarInstance.ruleNames[context.ruleIndex()]}`);
        }
        return ancestor;
    }

    private static getAncestorContextNullable(context: any, ruleIndex: number) {
        if (context.ruleIndex === ruleIndex) return context;
        if (context.parentCtx === null) return null;
        return this.getAncestorContextNullable(context.parentCtx, ruleIndex);
    }

    public static isExtensionNamespace(namespaceContext: any) {
        return namespaceContext.namespaceType().namespaceProjectExtension() !== null;
    }

    public static namespaceNameFor(namespaceContext: any) : string {
        return namespaceContext.namespaceName().NAMESPACE_ID().getText();
    }
}
