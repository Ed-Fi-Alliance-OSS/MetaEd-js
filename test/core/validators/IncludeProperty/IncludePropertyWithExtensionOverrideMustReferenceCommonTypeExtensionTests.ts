import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import ValidatorTestHelper from "../ValidatorTestHelper";
import ValidatorListener from "../../../../src/core/validators/ValidatorListener";
import {IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension}from "../../../../src/core/validators/IncludeProperty/IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension"

chai.should();

describe('IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.IncludePropertyContext>(
            new IncludePropertyWithExtensionOverrideMustReferenceCommonTypeExtension(helper.symbolTable)));


    describe('When_include_property_has_extension_override_of_non_common_type_extension', () => {
        const commonTypeName: string = "CommonType";
        let entityName: string = "MyIdentifier";
        let propertyName: string = "Identifier";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

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
            helper.errorMessageCollection.should.be.empty;
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].message.should.include("include extension");
            helper.errorMessageCollection[0].message.should.include(propertyName);
            helper.errorMessageCollection[0].message.should.include(entityName);
            helper.errorMessageCollection[0].message.should.include("invalid");
        });
    });


    describe('When_include_property_has_extension_override_of_common_type_extension', () => {
        const commonTypeName: string = "CommonType";
        let entityName: string = "MyIdentifier";
        let propertyName: string = "Identifier";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartCommonType(commonTypeName)
                .withDocumentation("doc")
                .withBooleanProperty("DummyProperty1", "doc", true, false)
                .withEndCommonType()
                
.withStartCommonTypeExtension(commonTypeName)
                .withBooleanProperty("DummyProperty3", "doc", true, false)
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

        it('should_not_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeFalse();
        });
    });
});