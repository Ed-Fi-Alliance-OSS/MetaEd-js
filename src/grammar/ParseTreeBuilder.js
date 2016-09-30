import antlr4 from 'antlr4/index';
import BaseLexer from './gen/BaseLexer';
import MetaEdGrammar from './gen/MetaEdGrammar';

import MetaEdErrorListener from './MetaEdErrorListener';

export default class ParseTreeBuilder {
    private metaEdErrorListener;

    constructor(metaEdErrorListener) {
        this.metaEdErrorListener = metaEdErrorListener;
    }

    buildParseTree(metaEdContents) {
        try {
            return this.errorIgnoringParser(metaEdContents).metaEd();
        } catch (parseCanceledException) {
            return this.errorListeningParser(metaEdContents).metaEd();
        }
    }

    buildTopLevelEntity(metaEdContents) {
        try {
            return this.errorIgnoringParser(metaEdContents).topLevelEntity();
        } catch (parseCanceledException) {
            return this.errorListeningParser(metaEdContents).topLevelEntity();
        }
    }

    private errorListeningParser(metaEdContents) {
        const lexer = new BaseLexer.BaseLexer(new antlr4.InputStream(metaEdContents));
        const parser = new MetaEdGrammar.MetaEdGrammar(new antlr4.CommonTokenStream(lexer, undefined));
        lexer.addErrorListener(this.metaEdErrorListener);
        parser.removeErrorListeners();
        parser.addErrorListener(this.metaEdErrorListener);
        return parser;
    }

    private errorIgnoringParser(metaEdContents) {
        const lexer = new BaseLexer.BaseLexer(new antlr4.InputStream(metaEdContents));
        const parser = new MetaEdGrammar.MetaEdGrammar(new antlr4.CommonTokenStream(lexer, undefined));
        parser.Interpreter.PredictionMode = antlr4.atn.PredictionMode.SLL;
        parser.Interpreter.tail_call_preserves_sll = false;
        parser.ErrorHandler = new antlr4.error.ErrorStrategy();
        return parser;
    }
}
