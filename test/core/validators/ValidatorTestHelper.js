// @flow
import {ValidationMessage} from '../../../src/common/ValidationMessage'
import SymbolTable from '../../../src/core/validators/SymbolTable'
import { MetaEdContext } from '../../../src/core/tasks/MetaEdContext'
import SingleFileMetaEdFileIndex from '../../../src/core/tasks/SingleFileMetaEdFileIndex'
import { SymbolTableBuilder } from  '../../../src/core/validators/SymbolTableBuilder'
import NullSymbolTableBuilderListener from '../../common/NullSymbolTableBuilderListener'
//import {IListenerWithContext} from "../../../src/core/validators/IListenerWithContext";

import antlr4 from 'antlr4';
import {MetaEdGrammar} from '../../../src/grammar/gen/MetaEdGrammar';
import BaseLexer from '../../../src/grammar/gen/BaseLexer';

export default class ValidatorTestHelper {
    symbolTable: SymbolTable;
    warningMessageCollection: ValidationMessage[];
    errorMessageCollection: ValidationMessage[];
    metaEdContext: MetaEdContext;
    parserContext: any;

    setup(metaEdText: string, validatorListener: any /* IListenerWithContext */, symbolTable: SymbolTable = new SymbolTable()): void {
        console.log(metaEdText);
        let metaEdFileIndex = new SingleFileMetaEdFileIndex();
        metaEdFileIndex.addContents(metaEdText);

        this.symbolTable = symbolTable;

        let antlrInputStream = new antlr4.InputStream(metaEdText);
        let lexer = new BaseLexer.BaseLexer(antlrInputStream);
        let tokens = new antlr4.CommonTokenStream(lexer);
        let parser = new MetaEdGrammar(tokens);
        this.parserContext = parser.metaEd();

        this.metaEdContext = new MetaEdContext(metaEdFileIndex, this.symbolTable);
        this.warningMessageCollection = this.metaEdContext.warningMessageCollection;
        this.errorMessageCollection = this.metaEdContext.errorMessageCollection;

        let symbolTableBuilder = new SymbolTableBuilder(new NullSymbolTableBuilderListener());
        symbolTableBuilder.withContext(this.metaEdContext);
        antlr4.tree.ParseTreeWalker.DEFAULT.walk(symbolTableBuilder, this.parserContext);

        validatorListener.withContext(this.metaEdContext);
        antlr4.tree.ParseTreeWalker.DEFAULT.walk(validatorListener, this.parserContext);
    }
}
