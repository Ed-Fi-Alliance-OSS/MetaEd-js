"use strict";
/// <reference path="../../typings/index.d.ts" />
let antlr4 = require('antlr4');
let BaseLexer = require('../../src/grammar/gen/BaseLexer');
let MetaEdGrammar = require('../../src/grammar/gen/MetaEdGrammar');
const MetaEdErrorListener_1 = require('../../src/grammar/MetaEdErrorListener');
const chai = require('chai');
chai.should();
describe('SimpleParseTest', () => {
    describe('Domain Entity', () => {
        it('should parse correctly', () => {
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
            const errorMessageCollection = [];
            const errorListener = new MetaEdErrorListener_1.default(errorMessageCollection);
            parser.removeErrorListeners();
            parser.addErrorListener(errorListener);
            parser.topLevelEntity();
            if (errorMessageCollection.length === 0) {
                console.log('No parse errors found');
            }
            else {
                for (const errorMessage of errorMessageCollection) {
                    console.log(errorMessage);
                }
            }
            errorMessageCollection.should.be.empty;
        });
    });
});
//# sourceMappingURL=SimpleParseTest.js.map