"use strict";
//let ParserRuleContext = require('antlr4')
class NullSymbolTableBuilderListener {
    withContext(context) {
    }
    beforeAddEntity(entityType, entityName, context) {
        return true;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = NullSymbolTableBuilderListener;
//# sourceMappingURL=NullSymbolTableBuilderListener.js.map