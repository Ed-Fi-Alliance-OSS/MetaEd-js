import antlr4 from 'antlr4';
import BaseLexer from '../../src/grammar/gen/BaseLexer';
import MetaEdGrammar from '../../src/grammar/gen/MetaEdGrammar';
import MetaEdErrorListener from '../../src/grammar/MetaEdErrorListener';

import chai from 'chai'
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
            const errorListener = new MetaEdErrorListener(errorMessageCollection);

            parser.removeErrorListeners();
            parser.addErrorListener(errorListener);
            parser.topLevelEntity();

            if (errorMessageCollection.length === 0) {
                console.log('No parse errors found');
            } else {
                for (const errorMessage of errorMessageCollection) {
                    console.log(errorMessage);
                }
            }

            errorMessageCollection.should.be.empty;
        });
    });
});
