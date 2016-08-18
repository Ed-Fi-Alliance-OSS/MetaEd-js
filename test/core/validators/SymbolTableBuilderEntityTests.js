"use strict";
/// <reference path="../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const NullSymbolTableBuilderListener_1 = require("../../common/NullSymbolTableBuilderListener");
const SymbolTable_1 = require("../../../src/core/validators/SymbolTable");
const SymbolTableBuilder_1 = require("../../../src/core/validators/SymbolTableBuilder");
const MetaEdContext_1 = require("../../../src/core/tasks/MetaEdContext");
const SingleFileMetaEdFileIndex_1 = require("../../../src/core/tasks/SingleFileMetaEdFileIndex");
let antlr4 = require('antlr4');
let BaseLexer = require('../../../src/grammar/gen/BaseLexer');
let MetaEdGrammar = require('../../../src/grammar/gen/MetaEdGrammar');
let should = chai.should();
describe('SymbolTableBuilderEntityTests', () => {
    describe('When_loading_domain_entity', () => {
        const symbolTableKey = "Domain Entity";
        const entityName = "EntityName";
        const propertyName = "PropertyName";
        let symbolTable;
        let warningMessageCollection;
        let errorMessageCollection;
        before(() => {
            const metaEdTextBuilder = new MetaEdTextBuilder_1.default();
            const metaEdText = metaEdTextBuilder
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withMetaEdId("100")
                .withDocumentation("doc")
                .withBooleanProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace()
                .toString();
            console.log(metaEdText);
            let metaEdFileIndex = new SingleFileMetaEdFileIndex_1.default();
            metaEdFileIndex.addContents(metaEdText);
            symbolTable = new SymbolTable_1.SymbolTable();
            let antlrInputStream = new antlr4.InputStream(metaEdText);
            let lexer = new BaseLexer.BaseLexer(antlrInputStream);
            let tokens = new antlr4.CommonTokenStream(lexer);
            let parser = new MetaEdGrammar.MetaEdGrammar(tokens);
            let parserContext = parser.metaEd();
            let metaEdContext = new MetaEdContext_1.MetaEdContext(metaEdFileIndex, symbolTable);
            warningMessageCollection = metaEdContext.WarningMessageCollection;
            errorMessageCollection = metaEdContext.ErrorMessageCollection;
            let builder = new SymbolTableBuilder_1.SymbolTableBuilder(new NullSymbolTableBuilderListener_1.default());
            builder.withContext(metaEdContext);
            antlr4.tree.ParseTreeWalker.DEFAULT.walk(builder, parserContext);
        });
        it('Should_load_into_symbol_table', () => {
            const entityContext = symbolTable.get(symbolTableKey, entityName);
            entityContext.should.not.be.empty;
            entityContext.name.should.equal(entityName);
            entityContext.context.should.not.be.empty;
        });
    });
});
//# sourceMappingURL=SymbolTableBuilderEntityTests.js.map