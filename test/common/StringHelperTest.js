import chai from 'chai';
import StringHelper from '../../src/common/StringHelper';

chai.should();

describe('StringHelperParseTest', () => {
  it('should substitute correctly', () => {
    const result1 = StringHelper.format('${}', 'Hello');
    result1.should.equal('Hello');

    const result2 = StringHelper.format('${} ${}', 'Hello', 'World');
    result2.should.equal('Hello World');

    const result3 = StringHelper.format('${} ${} ${}', 'Hello', 'World', 'Person');
    result3.should.equal('Hello World Person');
  });
});
