/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import {ValidationTestHelper} from "../ValidationTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {SecondDomainEntityPropertyMustNotCollideWithOtherProperty}from "../../../../src/core/validators/Associations/SecondDomainEntityPropertyMustNotCollideWithOtherProperty"

let should = chai.should();

describe('SecondDomainEntityPropertyMustNotCollideWithOtherProperty', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.SecondDomainEntityContext>(
            new SecondDomainEntityPropertyMustNotCollideWithOtherProperty(symbolTable)));


    describe('When_domain_entity_property_does_not_collide', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity("First")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()

                .withStartDomainEntity("Second")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()

                .withStartAssociation("Association1")
                .withDocumentation("doc")
                .withDomainEntityProperty("First", "doc1")
                .withDomainEntityProperty("Second", "doc2")
                .withIntegerProperty("Third", "doc3", false, false)
                .withEndAssociation()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.count.should.equal(0);
        });
    });


    describe('When_domain_entity_property_does_collide', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity("First")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()

                .withStartDomainEntity("Second")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()

                .withStartAssociation("Association1")
                .withDocumentation("doc")
                .withDomainEntityProperty("First", "doc1")
                .withDomainEntityProperty("Second", "doc2")
                .withIntegerProperty("Second", "doc3", false, false)
                .withEndAssociation()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.count.should.equal(1);
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.should.equal("Entity Association1 has duplicate properties named Second");
        });
    });
});