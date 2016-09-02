"use strict";
const MetaEdContext_1 = require('../../../src/core/tasks/MetaEdContext');
const SingleFileMetaEdFileIndex_1 = require('../../../src/core/tasks/SingleFileMetaEdFileIndex');
const SymbolTableBuilder_1 = require('../../../src/core/validators/SymbolTableBuilder');
const NullSymbolTableBuilderListener_1 = require('../../common/NullSymbolTableBuilderListener');
let antlr4 = require('antlr4/index');
let MetaEdGrammar = require('../../../src/grammar/gen/MetaEdGrammar').MetaEdGrammar;
let BaseLexer = require('../../../src/grammar/gen/BaseLexer');
class ValidatorTestHelper {
    setup(metaEdText, validatorListener, symbolTable) {
        console.log(metaEdText);
        let metaEdFileIndex = new SingleFileMetaEdFileIndex_1.default();
        metaEdFileIndex.addContents(metaEdText);
        this.symbolTable = symbolTable;
        let antlrInputStream = new antlr4.InputStream(metaEdText);
        let lexer = new BaseLexer.BaseLexer(antlrInputStream);
        let tokens = new antlr4.CommonTokenStream(lexer);
        let parser = new MetaEdGrammar(tokens);
        this.parserContext = parser.metaEd();
        this.metaEdContext = new MetaEdContext_1.MetaEdContext(metaEdFileIndex, this.symbolTable);
        this.warningMessageCollection = this.metaEdContext.warningMessageCollection;
        this.errorMessageCollection = this.metaEdContext.errorMessageCollection;
        let symbolTableBuilder = new SymbolTableBuilder_1.SymbolTableBuilder(new NullSymbolTableBuilderListener_1.default());
        symbolTableBuilder.withContext(this.metaEdContext);
        antlr4.tree.ParseTreeWalker.DEFAULT.walk(symbolTableBuilder, this.parserContext);
        validatorListener.withContext(this.metaEdContext);
        antlr4.tree.ParseTreeWalker.DEFAULT.walk(validatorListener, this.parserContext);
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ValidatorTestHelper;
//# sourceMappingURL=ValidatorTestHelper.js.map