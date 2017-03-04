import antlr4 from 'antlr4';
import chai from 'chai';
import BaseLexer from '../../src/grammar/gen/BaseLexer';
import MetaEdGrammar from '../../src/grammar/gen/MetaEdGrammar';
import MetaEdErrorListener from '../../src/grammar/MetaEdErrorListener';

chai.should();

describe('SimpleParseTests', () => {
  describe('Domain Entity', () => {
    it('should parse correctly', () => {
      const inputText = [
        'Domain Entity TestEntity',
        'documentation "This is the first line\nThis is more..."',
        '    integer MyProperty',
        '        documentation "Integer documentation"',
        '        is part of identity\n',
      ].join('\n');

      const stream = new antlr4.InputStream(inputText);
      const lexer = new BaseLexer.BaseLexer(stream);
      const tokens = new antlr4.CommonTokenStream(lexer, undefined);
      const parser = new MetaEdGrammar.MetaEdGrammar(tokens);

      const errorMessages = [];
      const errorListener = new MetaEdErrorListener(errorMessages);

      parser.removeErrorListeners();
      parser.addErrorListener(errorListener);
      parser.topLevelEntity();
      errorMessages.should.be.empty;
    });
  });
});
