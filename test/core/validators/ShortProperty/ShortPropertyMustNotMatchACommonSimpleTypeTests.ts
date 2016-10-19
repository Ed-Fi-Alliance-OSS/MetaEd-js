import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import {ValidatorTestHelper} from "../ValidatorTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {ShortPropertyMustNotMatchACommonSimpleType}from "../../../../src/core/validators/ShortProperty/ShortPropertyMustNotMatchACommonSimpleType"

let should = chai.should();

describe('ShortPropertyMustNotMatchACommonSimpleType', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.ShortPropertyContext>(
            new ShortPropertyMustNotMatchACommonSimpleType(helper.symbolTable)));


    describe('When_short_property_has_identifier_matching_no_common_simple_types', () => {
        let entityName: string = "EntityName";
        let propertyName: string = "PropertyName";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withShortProperty(propertyName, "doc", false, false, 10, 2)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_short_property_has_identifier_matching_common_decimal', () => {
        const commonEntityName: string = "CommonEntityName";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartCommonDecimal(commonEntityName)
                .withDocumentation("doc")
                .withTotalDigits("10")
                .withDecimalPlaces("2")
                .withEndCommonDecimal()

                .withStartDomainEntity("EntityName")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withShortProperty(commonEntityName, "doc", false, false, 10, 2)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].message.should.include("Short property");
            helper.errorMessageCollection[0].message.should.include(commonEntityName);
            helper.errorMessageCollection[0].message.should.include("has the same name");
        });
    });

    describe('When_short_property_has_identifier_matching_common_integer', () => {
        const commonEntityName: string = "CommonEntityName";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartCommonInteger(commonEntityName)
                .withDocumentation("doc")
                .withMaxValue(100)
                .withEndCommonInteger()

                .withStartDomainEntity("EntityName")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withShortProperty(commonEntityName, "doc", false, false, 10, 2)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].message.should.include("Short property");
            helper.errorMessageCollection[0].message.should.include(commonEntityName);
            helper.errorMessageCollection[0].message.should.include("has the same name");
        });
    });

    describe('When_short_property_has_identifier_matching_common_short', () => {
        const commonEntityName: string = "CommonEntityName";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartCommonShort(commonEntityName)
                .withDocumentation("doc")
                .withMaxValue(100)
                .withEndCommonShort()

                .withStartDomainEntity("EntityName")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withShortProperty(commonEntityName, "doc", false, false, 10, 2)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].message.should.include("Short property");
            helper.errorMessageCollection[0].message.should.include(commonEntityName);
            helper.errorMessageCollection[0].message.should.include("has the same name");
        });
    });

    describe('When_short_property_has_identifier_matching_common_string', () => {
        const commonEntityName: string = "CommonEntityName";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartCommonString(commonEntityName)
                .withDocumentation("doc")
                .withMaxLength(100)
                .withEndCommonString()

                .withStartDomainEntity("EntityName")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withShortProperty(commonEntityName, "doc", false, false, 10, 2)
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].message.should.include("Short property");
            helper.errorMessageCollection[0].message.should.include(commonEntityName);
            helper.errorMessageCollection[0].message.should.include("has the same name");
        });
    });
});