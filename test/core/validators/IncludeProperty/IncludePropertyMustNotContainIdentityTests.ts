import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import ValidatorTestHelper from "../ValidatorTestHelper";
import ValidatorListener from "../../../../src/core/validators/ValidatorListener";
import {IncludePropertyMustNotContainIdentity}from "../../../../src/core/validators/IncludeProperty/IncludePropertyMustNotContainIdentity"

chai.should();

describe('IncludePropertyMustNotContainIdentity', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.IncludePropertyContext>(
            new IncludePropertyMustNotContainIdentity()));


    describe('When_include_property_has_primary_key', () => {
        const commonTypeName: string = "CommonType";
        let entityName: string = "MyIdentifier";
        let propertyName: string = "Identifier";
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder.build()

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

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.should.be.empty;
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].message.should.include("Include");
            helper.errorMessageCollection[0].message.should.include(propertyName);
            helper.errorMessageCollection[0].message.should.include("invalid");
        });
    });
});