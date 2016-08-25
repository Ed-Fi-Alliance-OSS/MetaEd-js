/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import {ValidationTestHelper} from "../ValidationTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality}from "../../../../src/core/validators/IncludeProperty/IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality"

let should = chai.should();

describe('IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.IncludePropertyContext>(
            new IncludePropertyWithExtensionOverrideRestrictedToDomainEntityAndAssociationExtensionsAndMaintainsCardinality(helper.symbolTable)));


    describe('When_include_property_does_not_have_extension_override', () => {
        const commonTypeName: string = "CommonType";
        let entityName: string = "MyIdentifier";
        let propertyName: string = "Identifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartCommonType(commonTypeName)
                .withDocumentation("doc")
                .withStringProperty("StringProperty", "doc", true, false, 100)
                .withEndCommonType()
                
.withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withIdentityProperty("include", propertyName, "doc")
                .withEndDomainEntity()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_not_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeFalse();
        });
    });


    describe('When_include_property_has_extension_override_on_non_domain_entity_or_association_extensions', () => {
        const commonTypeName: string = "CommonType";
        let entityName: string = "MyIdentifier";
        let propertyName: string = "Identifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartCommonType(commonTypeName)
                .withDocumentation("doc")
                .withStringProperty("StringProperty", "doc", true, false, 100)
                .withEndCommonType()
                
.withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withIncludeExtensionOverrideProperty(commonTypeName, "doc", true, true)
                .withEndDomainEntity()
                .withEndNamespace();
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
        const commonTypeName: string = "CommonType";
        let entityName: string = "MyIdentifier";
        let propertyName: string = "Identifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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
                .withEndNamespace();
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
        const commonTypeName: string = "CommonType";
        let entityName: string = "MyIdentifier";
        let propertyName: string = "Identifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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
                .withEndNamespace();
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
        const commonTypeName: string = "CommonType";
        let entityName: string = "MyIdentifier";
        let propertyName: string = "Identifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_not_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeFalse();
        });
    });


    describe('When_include_property_has_extension_override_on_association_extension_with_include_on_extendee_with_matching_cardinality', () => {
        const commonTypeName: string = "CommonType";
        let entityName: string = "MyIdentifier";
        let propertyName: string = "Identifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_not_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeFalse();
        });
    });


    describe('When_include_property_has_extension_override_on_domain_entity_extension_with_include_on_extendee_not_matching_collection_cardinality', () => {
        const commonTypeName: string = "CommonType";
        let entityName: string = "MyIdentifier";
        let propertyName: string = "Identifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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
                .withEndNamespace();
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
        const commonTypeName: string = "CommonType";
        let entityName: string = "MyIdentifier";
        let propertyName: string = "Identifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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
                .withEndNamespace();
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
        const commonTypeName: string = "CommonType";
        let entityName: string = "MyIdentifier";
        let propertyName: string = "Identifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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
                .withEndNamespace();
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
        const commonTypeName: string = "CommonType";
        let entityName: string = "MyIdentifier";
        let propertyName: string = "Identifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

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
                .withEndNamespace();
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