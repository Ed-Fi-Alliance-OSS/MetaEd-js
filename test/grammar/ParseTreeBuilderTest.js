import chai from 'chai';
import MetaEdErrorListener from '../../src/grammar/MetaEdErrorListener';
import ParseTreeBuilder from '../../src/grammar/ParseTreeBuilder';
import MetaEdTextBuilder from './MetaEdTextBuilder';

chai.should();

describe('ParseTreeBuilder', () => {
  describe('Domain Entity', () => {
    it('should parse correctly with valid MetaEd', () => {
      const inputText = [
        'Domain Entity TestEntity',
        'documentation \'This is the first line',
        '              \'This is more...',
        '    integer MyProperty',
        '        documentation \'Integer documentation',
        '        is part of identity\n',
      ].join('\n');

      const errorMessageCollection = [];
      const errorListener = new MetaEdErrorListener(errorMessageCollection);
      const parseTreeBuilder = new ParseTreeBuilder(errorListener);
      parseTreeBuilder.buildTopLevelEntity(inputText);
      errorMessageCollection.should.be.empty;
    });

    it('should parse incorrectly with invalid MetaEd', () => {
      const inputText = [
        'Domain Entity TestEntity',
        'documentation \'This is the first line',
        '              \'This is more...',
        '    integer MyProperty xyz',
        '        documentation \'Integer documentation',
        '        is part of identity\n',
      ].join('\n');

      const errorMessageCollection = [];
      const errorListener = new MetaEdErrorListener(errorMessageCollection);
      const parseTreeBuilder = new ParseTreeBuilder(errorListener);
      parseTreeBuilder.buildTopLevelEntity(inputText);
      errorMessageCollection.should.not.be.empty;
      errorMessageCollection[0].message.should.include('xyz');
    });

    it('should parse correctly with valid MetaEd from MetaEdTextBuilder', () => {
      const builder = new MetaEdTextBuilder();
      const inputText =
        builder.withStartDomainEntity('TestEntity')
        .withDocumentation('This is the first line', 'This is more...')
        .withIntegerIdentity('MyProperty', 'Integer documentation')
        .withEndDomainEntity()
        .toString();

      const errorMessageCollection = [];
      const errorListener = new MetaEdErrorListener(errorMessageCollection);
      const parseTreeBuilder = new ParseTreeBuilder(errorListener);
      parseTreeBuilder.buildTopLevelEntity(inputText);
      errorMessageCollection.should.be.empty;
    });
  });
});
