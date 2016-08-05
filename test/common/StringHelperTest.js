"use strict";
/// <reference path="../../typings/index.d.ts" />
const StringHelper_1 = require('../../src/common/StringHelper');
const chai = require('chai');
chai.should();
describe('StringHelperParseTest', () => {
    it('should substitute correctly', () => {
        const result1 = StringHelper_1.default.format('{0}', 'Hello');
        result1.should.equal('Hello');
        const result2 = StringHelper_1.default.format('{0} {1}', 'Hello', 'World');
        result2.should.equal('Hello World');
        const result3 = StringHelper_1.default.format('{0} {1} {2}', 'Hello', 'World', 'Person');
        result3.should.equal('Hello World Person');
    });
});
//# sourceMappingURL=StringHelperTest.js.map