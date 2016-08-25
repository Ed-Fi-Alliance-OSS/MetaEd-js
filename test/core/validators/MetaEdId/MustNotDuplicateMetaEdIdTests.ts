/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import {ValidationTestHelper} from "../ValidationTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {MustNotDuplicateMetaEdId}from "../../../../src/core/validators/MetaEdId/MustNotDuplicateMetaEdId"

let should = chai.should();

describe('MustNotDuplicateMetaEdId', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.MetaEdIdContext>(
            new MustNotDuplicateMetaEdId()));


    describe('When_domain_entity_has_valid_metaEdId', () => {
        const metaEdId1: string = "100";
        const metaEdId2: string = "101";
        const entityName1: string = "MyIdentifier1";
        let propertyName1: string = "Identifier1";
        const entityName2: string = "MyIdentifier2";
        let propertyName2: string = "Identifier2";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName1)
                .withMetaEdId(metaEdId1)
                .withDocumentation("doc")
                .withStringIdentity(propertyName1, "doc", 100)
                .withEndDomainEntity()
                .withStartDomainEntity(entityName2)
                .withMetaEdId(metaEdId2)
                .withDocumentation("doc")
                .withStringIdentity(propertyName2, "doc", 100)
                .withEndDomainEntity()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_not_have_validation_failure()', () => {
            helper.errorMessageCollection.ShouldBeEmpty();
        });
    });


    describe('When_domain_entity_has_duplicate_metaEdId', () => {
        const metaEdId: string = "100";
        const entityName1: string = "MyIdentifier1";
        let propertyName1: string = "Identifier1";
        const entityName2: string = "MyIdentifier2";
        let propertyName2: string = "Identifier2";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName1)
                .withMetaEdId(metaEdId)
                .withDocumentation("doc")
                .withStringIdentity(propertyName1, "doc", 100)
                .withEndDomainEntity()
                .withStartDomainEntity(entityName2)
                .withMetaEdId(metaEdId)
                .withDocumentation("doc")
                .withStringIdentity(propertyName2, "doc", 100)
                .withEndDomainEntity()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.ShouldNotBeEmpty();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("MetaEdId");
            helper.errorMessageCollection[0].Message.ShouldContain(metaEdId);
            helper.errorMessageCollection[0].Message.ShouldContain("All MetaEdIds must be globally unique.");
        });
    });


    describe('When_domain_entity_has_duplicate_metaEdId_with_property', () => {
        const metaEdId: string = "100";
        let entityName: string = "MyIdentifier";
        let propertyName: string = "Identifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withMetaEdId(metaEdId)
                .withDocumentation("doc")
                .withStringIdentity(propertyName, "doc", 100, null, null, metaEdId)
                .withEndDomainEntity()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.ShouldNotBeEmpty();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("MetaEdId");
            helper.errorMessageCollection[0].Message.ShouldContain(metaEdId);
            helper.errorMessageCollection[0].Message.ShouldContain("All MetaEdIds must be globally unique.");
        });
    });


    describe('When_domain_entity_has_duplicate_metaEdId_with_property_on_different_entity', () => {
        const metaEdId: string = "100";
        const entityName1: string = "MyIdentifier1";
        let propertyName1: string = "Identifier1";
        const entityName2: string = "MyIdentifier2";
        let propertyName2: string = "Identifier2";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName1)
                .withMetaEdId(metaEdId)
                .withDocumentation("doc")
                .withStringIdentity(propertyName1, "doc", 100)
                .withEndDomainEntity()
                .withStartDomainEntity(entityName2)
                .withDocumentation("doc")
                .withStringIdentity(propertyName2, "doc", 100, null, null, metaEdId)
                .withEndDomainEntity()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.ShouldNotBeEmpty();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("MetaEdId");
            helper.errorMessageCollection[0].Message.ShouldContain(metaEdId);
            helper.errorMessageCollection[0].Message.ShouldContain("All MetaEdIds must be globally unique.");
        });
    });
});