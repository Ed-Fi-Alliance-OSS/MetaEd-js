/// <reference path="../../src/grammar/gen/MetaEdGrammarListener.d.ts" />
import Gen = require('../../src/grammar/gen/MetaEdGrammarListener');

class TestGrammarListener extends Gen.MetaEdGrammarListener {
    enterDomainEntity(context) {
        console.log("entered domain entity");
    }
}

let antlr4 = require('antlr4');
let BaseLexer = require('../../src/grammar/gen/BaseLexer');
let MetaEdGrammar = require('../../src/grammar/gen/MetaEdGrammar');

describe('HowToListen', () => {
    describe('Domain Entity', () => {
        it('should listen correctly', () => {
            const inputText = [
                'Domain Entity TestEntity',
                'documentation \'This is the first line',
                '              \'This is more...',
                '    integer MyProperty',
                '        documentation \'Integer documentation',
                '        is part of identity\n',
            ].join('\n');

            const stream = new antlr4.InputStream(inputText);
            const lexer = new BaseLexer.BaseLexer(stream);
            const tokens = new antlr4.CommonTokenStream(lexer, undefined);
            const parser = new MetaEdGrammar.MetaEdGrammar(tokens);

            let tree = parser.topLevelEntity();

            //// now listen
            let listener = new TestGrammarListener();
            antlr4.tree.ParseTreeWalker.DEFAULT.walk(listener, tree);
        });
    });
});
