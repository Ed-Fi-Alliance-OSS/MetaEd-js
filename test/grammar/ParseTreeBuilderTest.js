/// <reference path="../../typings/index.d.ts" />
"use strict";
const MetaEdErrorListener_1 = require('../../src/grammar/MetaEdErrorListener');
const ParseTreeBuilder_1 = require('../../src/grammar/ParseTreeBuilder');
const MetaEdTextBuilder_1 = require('./MetaEdTextBuilder');
const chai = require('chai');
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
            const errorListener = new MetaEdErrorListener_1.default(errorMessageCollection);
            const parseTreeBuilder = new ParseTreeBuilder_1.default(errorListener);
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
            const errorListener = new MetaEdErrorListener_1.default(errorMessageCollection);
            const parseTreeBuilder = new ParseTreeBuilder_1.default(errorListener);
            parseTreeBuilder.buildTopLevelEntity(inputText);
            errorMessageCollection.should.not.be.empty;
            errorMessageCollection[0].message.should.include('xyz');
        });
        it('should parse correctly with valid MetaEd from MetaEdTextBuilder', () => {
            const builder = new MetaEdTextBuilder_1.default();
            const inputText = builder.withStartDomainEntity('TestEntity')
                .withDocumentation('This is the first line', 'This is more...')
                .withIntegerIdentity('MyProperty', 'Integer documentation')
                .withEndDomainEntity()
                .toString();
            const errorMessageCollection = [];
            const errorListener = new MetaEdErrorListener_1.default(errorMessageCollection);
            const parseTreeBuilder = new ParseTreeBuilder_1.default(errorListener);
            parseTreeBuilder.buildTopLevelEntity(inputText);
            errorMessageCollection.should.be.empty;
        });
    });
});
//# sourceMappingURL=ParseTreeBuilderTest.js.map