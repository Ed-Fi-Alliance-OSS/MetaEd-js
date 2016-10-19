import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import {ValidatorTestHelper} from "../ValidatorTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {IncludePropertyMustNotContainIdentity}from "../../../../src/core/validators/IncludeProperty/IncludePropertyMustNotContainIdentity"

let should = chai.should();

describe('IncludePropertyMustNotContainIdentity', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.IncludePropertyContext>(
            new IncludePropertyMustNotContainIdentity()));


    describe('When_include_property_has_primary_key', () => {
        const commonTypeName: string = "CommonType";
        let entityName: string = "MyIdentifier";
        let propertyName: string = "Identifier";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

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
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Include");
            helper.errorMessageCollection[0].Message.ShouldContain(propertyName);
            helper.errorMessageCollection[0].Message.ShouldContain("invalid");
        });
    });
});