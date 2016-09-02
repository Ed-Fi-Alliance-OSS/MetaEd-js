"use strict";
const MetaEdGrammarInstance_1 = require('../grammar/MetaEdGrammarInstance');
class ValidationHelper {
    static getAncestorContext(context, ruleIndex) {
        let ancestor = this.getAncestorContextNullable(context, ruleIndex);
        if (ancestor === null) {
            const grammarInstance = MetaEdGrammarInstance_1.MetaEdGrammarInstance.instance;
            throw new Error(`Unable to find matching Ancestor {grammarInstance.ruleNames[ruleIndex]} on context of type {grammarInstance.ruleNames[context.ruleIndex()]}`);
        }
        return ancestor;
    }
    static getAncestorContextNullable(context, ruleIndex) {
        if (context.ruleIndex === ruleIndex)
            return context;
        if (context.parentCtx === null)
            return null;
        return this.getAncestorContextNullable(context.parentCtx, ruleIndex);
    }
    static isExtensionNamespace(namespaceContext) {
        return namespaceContext.namespaceType().namespaceProjectExtension() !== null;
    }
    static namespaceNameFor(namespaceContext) {
        return namespaceContext.namespaceName().NAMESPACE_ID().getText();
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ValidationHelper;
//# sourceMappingURL=ValidationHelper.js.map