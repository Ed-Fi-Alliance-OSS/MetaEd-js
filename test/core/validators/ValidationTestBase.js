"use strict";
const SymbolTable_1 = require('../../../src/core/validators/SymbolTable');
const MetaEdContext_1 = require('../../../src/core/tasks/MetaEdContext');
const SingleFileMetaEdFileIndex_1 = require('../../../src/core/tasks/SingleFileMetaEdFileIndex');
const SymbolTableBuilder_1 = require('../../../src/core/validators/SymbolTableBuilder');
const NullSymbolTableBuilderListener_1 = require('../../common/NullSymbolTableBuilderListener');
let antlr4 = require('antlr4/index');
let MetaEdGrammar = require('../../../src/grammar/gen/MetaEdGrammar');
let BaseLexer = require('../../../src/grammar/gen/BaseLexer');
class ValidationTestBase {
    setup() {
        let metaEdText = this.metaEdText();
        console.log(metaEdText);
        let metaEdFileIndex = new SingleFileMetaEdFileIndex_1.default();
        metaEdFileIndex.addContents(metaEdText);
        let antlrInputStream = new antlr4.InputStream(metaEdText);
        let lexer = new BaseLexer.BaseLexer(antlrInputStream);
        let tokens = new antlr4.CommonTokenStream(lexer);
        let parser = new MetaEdGrammar.MetaEdGrammar(tokens);
        this._parserContext = parser.metaEd();
        this._symbolTable = new SymbolTable_1.SymbolTable();
        this._metaEdContext = new MetaEdContext_1.MetaEdContext(metaEdFileIndex, this._symbolTable);
        this._warningMessageCollection = this._metaEdContext.WarningMessageCollection;
        this._errorMessageCollection = this._metaEdContext.ErrorMessageCollection;
        let builder = new SymbolTableBuilder_1.SymbolTableBuilder(new NullSymbolTableBuilderListener_1.default());
        builder.withContext(this._metaEdContext);
        antlr4.tree.ParseTreeWalker.DEFAULT.walk(builder, this._parserContext);
        this.setupPostBuilder();
    }
    setupPostBuilder() { }
}
exports.ValidationTestBase = ValidationTestBase;
//# sourceMappingURL=ValidationTestBase.js.map