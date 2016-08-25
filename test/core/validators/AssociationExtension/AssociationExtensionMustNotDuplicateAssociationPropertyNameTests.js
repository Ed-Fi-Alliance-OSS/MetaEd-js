"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
let should = chai.should();
describe('AssociationExtensionMustNotDuplicateAssociationPropertyName', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new AssociationExtensionMustNotDuplicateAssociationPropertyName()));
    describe('When_association_extension_has_different_property_name', () => {
        let entityName = "MyIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation(entityName)
                .withDocumentation("because documentation is required")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withBooleanProperty("Property1", "because a property is required", true, false)
                .withEndAssociation()
                .withStartAssociationExtension(entityName)
                .withBooleanProperty("Property2", "because a property is required", true, false)
                .withEndAssociationExtension()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.Count.ShouldEqual(0);
        });
    });
    describe('When_association_extension_has_duplicate_property_name', () => {
        let entityName = "MyIdentifier";
        const duplicatePropertyName = "Property1";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation(entityName)
                .withDocumentation("because documentation is required")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withBooleanProperty(duplicatePropertyName, "because a property is required", true, false)
                .withEndAssociation()
                .withStartAssociationExtension(entityName)
                .withBooleanProperty(duplicatePropertyName, "because a property is required", true, false)
                .withEndAssociationExtension()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Association additions");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain(duplicatePropertyName);
            helper.errorMessageCollection[0].Message.ShouldContain("already in property list");
        });
    });
    describe('When_association_extension_has_multiple_association_names', () => {
        let entityName = "MyIdentifier";
        const _not_duplicate_property_name = "NotADuplicate";
        const duplicatePropertyName1 = "Property1";
        const duplicatePropertyName2 = "Property2";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation(entityName)
                .withDocumentation("because documentation is required")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withBooleanProperty(duplicatePropertyName1, "because a property is required", true, false)
                .withBooleanProperty(duplicatePropertyName2, "because a property is required", true, false)
                .withEndAssociation()
                .withStartAssociationExtension(entityName)
                .withBooleanProperty(duplicatePropertyName1, "because a property is required", true, false)
                .withBooleanProperty(duplicatePropertyName2, "because a property is required", true, false)
                .withBooleanProperty(When_association_extension_has_multiple_association_names._not_duplicate_property_name, "because a property is required", true, false)
                .withEndAssociationExtension()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Association additions");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain(duplicatePropertyName1);
            helper.errorMessageCollection[0].Message.ShouldContain(duplicatePropertyName2);
            helper.errorMessageCollection[0].Message.ShouldContain("already in property list");
            helper.errorMessageCollection[0].Message.ShouldNotContain(When_association_extension_has_multiple_association_names._not_duplicate_property_name);
        });
    });
    describe('When_association_extension_has_duplicate_include_property', () => {
        let entityName = "MyIdentifier";
        const duplicatePropertyName = "Property1";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation(entityName)
                .withDocumentation("doc")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withIncludeProperty(duplicatePropertyName, "doc", true, false)
                .withEndAssociation()
                .withStartAssociationExtension(entityName)
                .withIncludeProperty(duplicatePropertyName, "doc", true, false)
                .withEndAssociationExtension()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
    });
    describe('When_association_extension_has_duplicate_include_extension_override_property', () => {
        let entityName = "MyIdentifier";
        const duplicatePropertyName = "Property1";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartAssociation(entityName)
                .withDocumentation("doc")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withIncludeProperty(duplicatePropertyName, "doc", true, false)
                .withEndAssociation()
                .withStartAssociationExtension(entityName)
                .withIncludeExtensionOverrideProperty(duplicatePropertyName, "doc", true, false)
                .withEndAssociationExtension()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_not_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeFalse();
        });
    });
});
//# sourceMappingURL=AssociationExtensionMustNotDuplicateAssociationPropertyNameTests.js.map