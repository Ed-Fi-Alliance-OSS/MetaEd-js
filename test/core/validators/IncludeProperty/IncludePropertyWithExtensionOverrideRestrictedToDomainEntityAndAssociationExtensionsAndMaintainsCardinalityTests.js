"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidatorTestHelper_1 = require("../ValidatorTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality_1 = require("../../../../src/core/validators/IncludeProperty/IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality");
let should = chai.should();
describe('IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality_1.IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality(helper.symbolTable)));
    describe('When_include_property_does_not_have_extension_override', () => {
        const commonTypeName = "CommonType";
        let entityName = "MyIdentifier";
        let propertyName = "Identifier";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonType(commonTypeName)
                .withDocumentation("doc")
                .withStringProperty("StringProperty", "doc", true, false, 100)
                .withEndCommonType()
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withIdentityProperty("include", propertyName, "doc")
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_not_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeFalse();
        });
    });
    describe('When_include_property_has_extension_override_on_non_domain_entity_or_association_extensions', () => {
        const commonTypeName = "CommonType";
        let entityName = "MyIdentifier";
        let propertyName = "Identifier";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonType(commonTypeName)
                .withDocumentation("doc")
                .withStringProperty("StringProperty", "doc", true, false, 100)
                .withEndCommonType()
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withIncludeExtensionOverrideProperty(commonTypeName, "doc", true, true)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("include extension");
            helper.errorMessageCollection[0].Message.ShouldContain(propertyName);
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("invalid");
        });
    });
    describe('When_include_property_has_extension_override_on_domain_entity_extension_without_include_on_extendee', () => {
        const commonTypeName = "CommonType";
        let entityName = "MyIdentifier";
        let propertyName = "Identifier";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonType(commonTypeName)
                .withDocumentation("doc")
                .withBooleanProperty("DummyProperty1", "doc", true, false)
                .withEndCommonType()
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty("DummyProperty2", "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace()
                .withBeginNamespace("extension", "EXTENSION")
                .withStartDomainEntityExtension(entityName)
                .withIncludeExtensionOverrideProperty(commonTypeName, "doc", true, true)
                .withEndDomainEntityExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("include extension");
            helper.errorMessageCollection[0].Message.ShouldContain(propertyName);
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("invalid");
        });
    });
    describe('When_include_property_has_extension_override_on_association_extension_without_include_on_extendee', () => {
        const commonTypeName = "CommonType";
        let entityName = "MyIdentifier";
        let propertyName = "Identifier";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonType(commonTypeName)
                .withDocumentation("doc")
                .withBooleanProperty("DummyProperty1", "doc", true, false)
                .withEndCommonType()
                .withStartAssociation(entityName)
                .withDocumentation("doc")
                .withDomainEntityProperty("DummyEntity1", "doc")
                .withDomainEntityProperty("DummyEntity2", "doc")
                .withBooleanProperty("DummyProperty2", "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace()
                .withBeginNamespace("extension", "EXTENSION")
                .withStartAssociationExtension(entityName)
                .withIncludeExtensionOverrideProperty(commonTypeName, "doc", true, true)
                .withEndDomainEntityExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("include extension");
            helper.errorMessageCollection[0].Message.ShouldContain(propertyName);
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("invalid");
        });
    });
    describe('When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_matching_cardinality', () => {
        const commonTypeName = "CommonType";
        let entityName = "MyIdentifier";
        let propertyName = "Identifier";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonType(commonTypeName)
                .withDocumentation("doc")
                .withBooleanProperty("DummyProperty1", "doc", true, false)
                .withEndCommonType()
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty("DummyProperty2", "doc", true, false)
                .withIncludeProperty(commonTypeName, "doc", true, true)
                .withEndDomainEntity()
                .withEndNamespace()
                .withBeginNamespace("extension", "EXTENSION")
                .withStartDomainEntityExtension(entityName)
                .withIncludeExtensionOverrideProperty(commonTypeName, "doc", true, true)
                .withEndDomainEntityExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_not_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeFalse();
        });
    });
    describe('When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_with_matching_cardinality', () => {
        const commonTypeName = "CommonType";
        let entityName = "MyIdentifier";
        let propertyName = "Identifier";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonType(commonTypeName)
                .withDocumentation("doc")
                .withBooleanProperty("DummyProperty1", "doc", true, false)
                .withEndCommonType()
                .withStartAssociation(entityName)
                .withDocumentation("doc")
                .withDomainEntityProperty("DummyEntity1", "doc")
                .withDomainEntityProperty("DummyEntity2", "doc")
                .withIncludeProperty(commonTypeName, "doc", true, true)
                .withBooleanProperty("DummyProperty2", "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace()
                .withBeginNamespace("extension", "EXTENSION")
                .withStartAssociationExtension(entityName)
                .withIncludeExtensionOverrideProperty(commonTypeName, "doc", true, true)
                .withEndDomainEntityExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_not_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeFalse();
        });
    });
    describe('When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_not_matching_collection_cardinality', () => {
        const commonTypeName = "CommonType";
        let entityName = "MyIdentifier";
        let propertyName = "Identifier";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonType(commonTypeName)
                .withDocumentation("doc")
                .withBooleanProperty("DummyProperty1", "doc", true, false)
                .withEndCommonType()
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty("DummyProperty2", "doc", true, false)
                .withIncludeProperty(commonTypeName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace()
                .withBeginNamespace("extension", "EXTENSION")
                .withStartDomainEntityExtension(entityName)
                .withIncludeExtensionOverrideProperty(commonTypeName, "doc", true, true)
                .withEndDomainEntityExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("include extension");
            helper.errorMessageCollection[0].Message.ShouldContain(propertyName);
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("invalid");
        });
    });
    describe('When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_not_matching_nullability', () => {
        const commonTypeName = "CommonType";
        let entityName = "MyIdentifier";
        let propertyName = "Identifier";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonType(commonTypeName)
                .withDocumentation("doc")
                .withBooleanProperty("DummyProperty1", "doc", true, false)
                .withEndCommonType()
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty("DummyProperty2", "doc", true, false)
                .withIncludeProperty(commonTypeName, "doc", false, true)
                .withEndDomainEntity()
                .withEndNamespace()
                .withBeginNamespace("extension", "EXTENSION")
                .withStartDomainEntityExtension(entityName)
                .withIncludeExtensionOverrideProperty(commonTypeName, "doc", true, true)
                .withEndDomainEntityExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("include extension");
            helper.errorMessageCollection[0].Message.ShouldContain(propertyName);
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("invalid");
        });
    });
    describe('When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_not_matching_collection_cardinality', () => {
        const commonTypeName = "CommonType";
        let entityName = "MyIdentifier";
        let propertyName = "Identifier";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonType(commonTypeName)
                .withDocumentation("doc")
                .withBooleanProperty("DummyProperty1", "doc", true, false)
                .withEndCommonType()
                .withStartAssociation(entityName)
                .withDocumentation("doc")
                .withDomainEntityProperty("DummyEntity1", "doc")
                .withDomainEntityProperty("DummyEntity2", "doc")
                .withIncludeProperty(commonTypeName, "doc", true, false)
                .withBooleanProperty("DummyProperty2", "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace()
                .withBeginNamespace("extension", "EXTENSION")
                .withStartAssociationExtension(entityName)
                .withIncludeExtensionOverrideProperty(commonTypeName, "doc", true, true)
                .withEndDomainEntityExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("include extension");
            helper.errorMessageCollection[0].Message.ShouldContain(propertyName);
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("invalid");
        });
    });
    describe('When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_not_matching_nullability', () => {
        const commonTypeName = "CommonType";
        let entityName = "MyIdentifier";
        let propertyName = "Identifier";
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartCommonType(commonTypeName)
                .withDocumentation("doc")
                .withBooleanProperty("DummyProperty1", "doc", true, false)
                .withEndCommonType()
                .withStartAssociation(entityName)
                .withDocumentation("doc")
                .withDomainEntityProperty("DummyEntity1", "doc")
                .withDomainEntityProperty("DummyEntity2", "doc")
                .withIncludeProperty(commonTypeName, "doc", false, true)
                .withBooleanProperty("DummyProperty2", "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace()
                .withBeginNamespace("extension", "EXTENSION")
                .withStartAssociationExtension(entityName)
                .withIncludeExtensionOverrideProperty(commonTypeName, "doc", true, true)
                .withEndDomainEntityExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("include extension");
            helper.errorMessageCollection[0].Message.ShouldContain(propertyName);
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("invalid");
        });
    });
});
//# sourceMappingURL=IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinalityTests.js.map