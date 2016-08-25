"use strict";
/// <reference path="../../../typings/index.d.ts" />
const chai = require('chai');
const ValidationTestHelper_1 = require("./ValidationTestHelper");
const ValidatorListener_1 = require("../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("./TestRuleProvider");
const TestDomainEntityContextValidation_1 = require("./TestDomainEntityContextValidation");
let should = chai.should();
//TODO: this needs to be revisited.
describe('ValidatorListenerTests', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new TestDomainEntityContextValidation_1.TestDomainEntityContextValidation()));
    describe('When_validating_meta_ed_grammar', () => {
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = "Begin Namespace edfi core \n Domain Entity Test1 \n     documentation 'some documentation \n     string Property1 \n         documentation 'Property documentation starts here \n         is part of identity \n         max length 50 \n Domain Entity Test2 \n     documentation 'duck documentation \n       integer Property1 \n         documentation 'Property documentation starts here \n         is part of identity \n Domain Entity Test3 \n     documentation 'elephant documentation \n   date Property1 \n         documentation 'Property documentation starts here \n         is part of identity \n Domain Entity Test4 \n     documentation 'raccoon documentation \n     'raccoon documentation \n     'raccoon documentation \n     bool Property1 \n         documentation 'Property documentation starts here \n         is part of identity \n End Namespace \n";
            helper.setup(metaEdText, validatorListener);
        });
        it('should_fail_for_each_domain_entity', () => {
            helper.errorMessageCollection.count.should.equal(4);
        });
        it('should_set_line_numbers_for_each_validation', () => {
            helper.errorMessageCollection[0].ConcatenatedLineNumber.should.equal(4);
            helper.errorMessageCollection[1].ConcatenatedLineNumber.should.equal(10);
            helper.errorMessageCollection[2].ConcatenatedLineNumber.should.equal(15);
            helper.errorMessageCollection[3].ConcatenatedLineNumber.should.equal(22);
        });
        it('should_set_character_position_for_each_validation', () => {
            helper.errorMessageCollection[0].CharacterPosition.should.equal(4);
            helper.errorMessageCollection[1].CharacterPosition.should.equal(6);
            helper.errorMessageCollection[2].CharacterPosition.should.equal(2);
            helper.errorMessageCollection[3].CharacterPosition.should.equal(4);
        });
    });
});
//# sourceMappingURL=ValidatorListenerTests.js.map