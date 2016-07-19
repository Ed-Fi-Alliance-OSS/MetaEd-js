"use strict";
/// <reference path="../../typings/globals/node/index.d.ts" />
let antlr4 = require('antlr4');
let BaseLexer = require('./gen/BaseLexer');
let MetaEdGrammar = require('./gen/MetaEdGrammar');
class ParseTreeBuilder {
    constructor(metaEdErrorListener) {
        this.metaEdErrorListener = metaEdErrorListener;
    }
    buildParseTree(metaEdContents) {
        try {
            return this.errorIgnoringParser(metaEdContents).metaEd();
        }
        catch (parseCanceledException) {
            return this.errorListeningParser(metaEdContents).metaEd();
        }
    }
    buildTopLevelEntity(metaEdContents) {
        try {
            return this.errorIgnoringParser(metaEdContents).topLevelEntity();
        }
        catch (parseCanceledException) {
            return this.errorListeningParser(metaEdContents).topLevelEntity();
        }
    }
    errorListeningParser(metaEdContents) {
        const lexer = new BaseLexer.BaseLexer(new antlr4.InputStream(metaEdContents));
        const tokens = new antlr4.CommonTokenStream(lexer, undefined);
        const parser = new MetaEdGrammar.MetaEdGrammar(tokens);
        lexer.addErrorListener(this.metaEdErrorListener);
        parser.removeErrorListeners();
        parser.addErrorListener(this.metaEdErrorListener);
        return parser;
    }
    errorIgnoringParser(metaEdContents) {
        const lexer = new BaseLexer.BaseLexer(antlr4.InputStream(metaEdContents));
        const tokens = new antlr4.CommonTokenStream(lexer, undefined);
        const parser = new MetaEdGrammar.MetaEdGrammar(tokens);
        parser.Interpreter.PredictionMode = antlr4.atn.PredictionMode.SLL;
        parser.Interpreter.tail_call_preserves_sll = false;
        parser.ErrorHandler = new antlr4.error.ErrorStrategy();
        return parser;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParseTreeBuilder;
//# sourceMappingURL=ParseTreeBuilder.js.map