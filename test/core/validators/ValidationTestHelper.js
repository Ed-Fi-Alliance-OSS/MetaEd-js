"use strict";
const SymbolTable_1 = require('../../../src/core/validators/SymbolTable');
const MetaEdContext_1 = require('../../../src/core/tasks/MetaEdContext');
const SingleFileMetaEdFileIndex_1 = require('../../../src/core/tasks/SingleFileMetaEdFileIndex');
const SymbolTableBuilder_1 = require('../../../src/core/validators/SymbolTableBuilder');
const NullSymbolTableBuilderListener_1 = require('../../common/NullSymbolTableBuilderListener');
let antlr4 = require('antlr4/index');
let MetaEdGrammar = require('../../../src/grammar/gen/MetaEdGrammar');
let BaseLexer = require('../../../src/grammar/gen/BaseLexer');
class ValidationTestHelper {
    setup(metaEdText) {
        console.log(metaEdText);
        let metaEdFileIndex = new SingleFileMetaEdFileIndex_1.default();
        metaEdFileIndex.addContents(metaEdText);
        this.symbolTable = new SymbolTable_1.SymbolTable();
        let antlrInputStream = new antlr4.InputStream(metaEdText);
        let lexer = new BaseLexer.BaseLexer(antlrInputStream);
        let tokens = new antlr4.CommonTokenStream(lexer);
        let parser = new MetaEdGrammar.MetaEdGrammar(tokens);
        let parserContext = parser.metaEd();
        let metaEdContext = new MetaEdContext_1.MetaEdContext(metaEdFileIndex, this.symbolTable);
        this.warningMessageCollection = metaEdContext.WarningMessageCollection;
        this.errorMessageCollection = metaEdContext.ErrorMessageCollection;
        let builder = new SymbolTableBuilder_1.SymbolTableBuilder(new NullSymbolTableBuilderListener_1.default());
        builder.withContext(metaEdContext);
        antlr4.tree.ParseTreeWalker.DEFAULT.walk(builder, parserContext);
    }
}
exports.ValidationTestHelper = ValidationTestHelper;
//# sourceMappingURL=ValidationTestHelper.js.map