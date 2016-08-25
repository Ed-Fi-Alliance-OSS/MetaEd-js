/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import {ValidationTestHelper} from "../ValidationTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {DomainEntityMustContainAnIdentity}from "../../../../src/core/validators/DomainEntity/DomainEntityMustContainAnIdentity"

let should = chai.should();

describe('DomainEntityMustContainAnIdentityTests', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.DomainEntityContext>(
            new DomainEntityMustContainAnIdentity()));


    describe('When_validating_domain_entity_with_identity_fields', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity("DomainEntity1")
                .withDocumentation("doc1")
                .withStringIdentity("Property1", "doc2", 100)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.count.should.equal(0);
        });
    });


    describe('When_validating_domain_entity_with_no_identity_fields', () => {
        let entityName: string = "MyIdentifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc1")
                .withDateProperty("Property1", "doc2", true, false)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Domain Entity");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("does not have an identity");
        });
    });
});