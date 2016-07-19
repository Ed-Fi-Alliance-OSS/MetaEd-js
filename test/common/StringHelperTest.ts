/// <reference path="../../typings/index.d.ts" />
import StringHelper from '../../src/common/StringHelper';

import chai = require('chai');
chai.should();

describe('StringHelperParseTest', () => {
    it('should substitute correctly', () => {
        const result1 = StringHelper.format('{0}', 'Hello');
        result1.should.equal('Hello');

        const result2 = StringHelper.format('{0} {1}', 'Hello', 'World');
        result2.should.equal('Hello World');

        const result3 = StringHelper.format('{0} {1} {2}', 'Hello', 'World', 'Person');
        result3.should.equal('Hello World Person');
    });
});
