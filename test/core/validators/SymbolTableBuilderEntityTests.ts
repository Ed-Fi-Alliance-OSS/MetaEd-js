/// <reference path="../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import NullSymbolTableBuilderListener from "../../common/NullSymbolTableBuilderListener";
import {SymbolTable} from "../../../src/core/validators/SymbolTable";
import List from 'typescript-dotnet-commonjs/System/Collections/List'
import {ParserRuleContext, SymbolTableBuilder} from "../../../src/core/validators/SymbolTableBuilder";
import {IMetaEdContext, MetaEdContext} from "../../../src/core/tasks/MetaEdContext";
import ValidationMessage from "../../../src/common/ValidationMessage";
import SingleFileMetaEdFileIndex from "../../../src/core/tasks/SingleFileMetaEdFileIndex";

let antlr4 = require('antlr4');
let BaseLexer = require('../../../src/grammar/gen/BaseLexer');
let MetaEdGrammar = require('../../../src/grammar/gen/MetaEdGrammar');
let should = chai.should();

describe('SymbolTableBuilderEntityTests', () => {
    describe('When_loading_domain_entity', () => {
        const symbolTableKey : string  = "Domain Entity";
        const entityName = "EntityName";
        const propertyName = "PropertyName";

        let symbolTable: SymbolTable;
        let warningMessageCollection: List<ValidationMessage>;
        let errorMessageCollection: List<ValidationMessage>;

        before( () => {
            const metaEdTextBuilder: MetaEdTextBuilder = new MetaEdTextBuilder();
            const metaEdText: string = metaEdTextBuilder
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withMetaEdId("100")
                .withDocumentation("doc")
                .withBooleanProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace()
                .toString();

            console.log(metaEdText);
            let metaEdFileIndex = new SingleFileMetaEdFileIndex();
            metaEdFileIndex.addContents(metaEdText);

            symbolTable = new SymbolTable();

            let antlrInputStream = new antlr4.InputStream(metaEdText);
            let lexer = new BaseLexer.BaseLexer(antlrInputStream);
            let tokens = new antlr4.CommonTokenStream(lexer);
            let parser = new MetaEdGrammar.MetaEdGrammar(tokens);
            let parserContext = parser.metaEd();
            let metaEdContext = new MetaEdContext(metaEdFileIndex, symbolTable);

            warningMessageCollection = metaEdContext.WarningMessageCollection;
            errorMessageCollection = metaEdContext.ErrorMessageCollection;
            let builder = new SymbolTableBuilder(new NullSymbolTableBuilderListener());
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

