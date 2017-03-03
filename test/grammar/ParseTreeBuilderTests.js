import chai from 'chai';
import MetaEdErrorListener from '../../src/grammar/MetaEdErrorListener';
import { buildTopLevelEntity } from '../../src/grammar/ParseTreeBuilder';
import MetaEdTextBuilder from './MetaEdTextBuilder';
import { createFileIndex } from '../../src/core/tasks/FileIndex';
import { createMetaEdFile } from '../../src/core/tasks/MetaEdFile';

chai.should();

describe('ParseTreeBuilderTests', () => {
  const stubFileIndex = createFileIndex([createMetaEdFile('', '', '')]);

  describe('Domain Entity', () => {
    it('should parse correctly with valid MetaEd', () => {
      const inputText = [
        'Domain Entity TestEntity',
        'documentation "This is the first line\nThis is more..."',
        '    integer MyProperty',
        '        documentation "Integer documentation"',
        '        is part of identity\n',
      ].join('\n');

      const errorMessages = [];

      const errorListener = new MetaEdErrorListener(errorMessages, stubFileIndex);
      buildTopLevelEntity(errorListener, inputText);
      errorMessages.should.be.empty;
    });

    it('should parse incorrectly with invalid MetaEd', () => {
      const inputText = [
        'Domain Entity TestEntity',
        'documentation "This is the first line\nThis is more..."',
        '    integer MyProperty xyz',
        '        documentation "Integer documentation"',
        '        is part of identity\n',
      ].join('\n');

      const errorMessages = [];
      const errorListener = new MetaEdErrorListener(errorMessages, stubFileIndex);
      buildTopLevelEntity(errorListener, inputText);
      errorMessages.should.not.be.empty;
      errorMessages[0].message.should.include('xyz');
    });

    it('should parse correctly with valid MetaEd from MetaEdTextBuilder', () => {
      const builder = new MetaEdTextBuilder();
      const inputText =
        builder.withStartDomainEntity('TestEntity')
        .withDocumentation('This is the first line\nThis is more...')
        .withIntegerIdentity('MyProperty', 'Integer documentation')
        .withEndDomainEntity()
        .toString();

      const errorMessages = [];
      const errorListener = new MetaEdErrorListener(errorMessages, stubFileIndex);
      buildTopLevelEntity(errorListener, inputText);
      errorMessages.should.be.empty;
    });
  });
});
