/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import {ValidationTestHelper} from "../ValidationTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName}from "../../../../src/core/validators/DomainEntityExtension/DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName"

let should = chai.should();

describe('DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.DomainEntityExtensionContext>(
            new DomainEntityExtensionMustNotDuplicateDomainEntityPropertyName(helper.symbolTable)));


    describe('When_domain_entity_extension_has_different_property_name', () => {
        let entityName: string = "MyIdentifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("because documentation is required")
                .withBooleanProperty("Property1", "because a property is required", true, false)
                .withEndDomainEntity()

                .withStartDomainEntityExtension(entityName)
                .withBooleanProperty("Property2", "because a property is required", true, false)
                .withEndDomainEntityExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.count.should.equal(0);
        });
    });


    describe('When_domain_entity_extension_has_duplicate_property_name', () => {
        let entityName: string = "MyIdentifier";
        const duplicatePropertyName: string = "Property1";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("because documentation is required")
                .withBooleanProperty(duplicatePropertyName, "because a property is required", true, false)
                .withEndDomainEntity()

                .withStartDomainEntityExtension(entityName)
                .withBooleanProperty(duplicatePropertyName, "because a property is required", true, false)
                .withEndDomainEntityExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Domain Entity additions");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain(duplicatePropertyName);
            helper.errorMessageCollection[0].Message.ShouldContain("already in property list");
        });
    });


    describe('When_domain_entity_extension_has_multiple_duplicate_property_names', () => {
        let entityName: string = "MyIdentifier";
        const notDuplicatePropertyName: string = "NotADuplicate";
        const duplicatePropertyName1: string = "Property1";
        const duplicatePropertyName2: string = "Property2";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("because documentation is required")
                .withBooleanProperty(duplicatePropertyName1, "because a property is required", true, false)
                .withBooleanProperty(duplicatePropertyName2, "because a property is required", true, false)
                .withEndDomainEntity()

                .withStartDomainEntityExtension(entityName)
                .withBooleanProperty(duplicatePropertyName1, "because a property is required", true, false)
                .withBooleanProperty(duplicatePropertyName2, "because a property is required", true, false)
                .withBooleanProperty(notDuplicatePropertyName, "because a property is required", true, false)
                .withEndDomainEntityExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Domain Entity additions");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain(duplicatePropertyName1);
            helper.errorMessageCollection[0].Message.ShouldContain(duplicatePropertyName2);
            helper.errorMessageCollection[0].Message.ShouldContain("already in property list");
            helper.errorMessageCollection[0].Message.ShouldNotContain(notDuplicatePropertyName);
        });
    });


    describe('When_domain_entity_extension_has_duplicate_include_property', () => {
        let entityName: string = "MyIdentifier";
        const duplicatePropertyName: string = "Property1";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withIncludeProperty(duplicatePropertyName, "doc", true, false)
                .withEndDomainEntity()

                .withStartDomainEntityExtension(entityName)
                .withIncludeProperty(duplicatePropertyName, "doc", true, false)
                .withEndDomainEntityExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
    });


    describe('When_domain_entity_extension_has_duplicate_include_extension_override_property', () => {
        let entityName: string = "MyIdentifier";
        const duplicatePropertyName: string = "Property1";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withIncludeProperty(duplicatePropertyName, "doc", true, false)
                .withEndDomainEntity()

                .withStartDomainEntityExtension(entityName)
                .withIncludeExtensionOverrideProperty(duplicatePropertyName, "doc", true, false)
                .withEndDomainEntityExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_not_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeFalse();
        });
    });
});