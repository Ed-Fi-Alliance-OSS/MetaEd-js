/// <reference path="../../../typings/globals/node/index.d.ts" />
let antlr4 = require('antlr4');
let Trees = require('antlr4/tree/Trees').Trees;
let BaseLexer = require('./../../../src/grammar/gen/BaseLexer');
let MetaEdGrammar = require('./../../../src/grammar/gen/MetaEdGrammar');

export default class ParserTestHelper {
    static parse (inputText: string) {
        const inputStream = new antlr4.InputStream(inputText);
        const lexer = new BaseLexer.BaseLexer(inputStream);
        const tokens = new antlr4.CommonTokenStream(lexer, undefined);
        const parser = new MetaEdGrammar.MetaEdGrammar(tokens);
        return parser;
    }

    static hasErrors(ruleContext) {
        if (ruleContext.exception != null) return true;
        if (ruleContext.children == null) return false;

        for (let childContext of ruleContext.children)
        {
            if (this.isErrorNode(childContext)) return true;
            if (this.hasErrors(childContext)) return true;
        }
        return false;
    }

    private static isErrorNode(ruleContext) {
        return ruleContext.isErrorNode !== undefined && ruleContext.isErrorNode();
    }

    static toStringTree(ruleContext, parser): string {
        return Trees.toStringTree(ruleContext, parser.ruleNames, parser.getTokenTypeMap);
    }
}
