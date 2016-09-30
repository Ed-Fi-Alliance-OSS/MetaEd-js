// @flow
import grammarInstance from '../../grammar/MetaEdGrammarInstance';

export function getAncestorContext(ruleContext: any, ruleIndex: number) {
    let ancestor = getAncestorContextNullable(ruleContext, ruleIndex);
    if (ancestor === null) {
        throw new Error(`Unable to find matching Ancestor ${grammarInstance.ruleNames[ruleIndex]} on context of type ${grammarInstance.ruleNames[ruleContext.ruleIndex()]}`);
    }
    return ancestor;
}

function getAncestorContextNullable(ruleContext: any, ruleIndex: number) {
    if (ruleContext.ruleIndex === ruleIndex) return ruleContext;
    if (ruleContext.parentCtx === null) return null;
    return getAncestorContextNullable(ruleContext.parentCtx, ruleIndex);
}

export function isExtensionNamespace(namespaceContext: any) {
    return namespaceContext.namespaceType().namespaceProjectExtension() !== null;
}

export function namespaceNameFor(namespaceContext: any) : string {
    return namespaceContext.namespaceName().NAMESPACE_ID().getText();
}

