import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import {ValidatorTestHelper} from "../ValidatorTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {MergePartOfReferenceExistsOnlyInCoreNamespace}from "../../../../src/core/validators/MergePartOfReference/MergePartOfReferenceExistsOnlyInCoreNamespace"

let should = chai.should();
//TODO: special case?

describe('MergePartOfReferenceExistsOnlyInCoreNamespace', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.MergePartOfReferenceContext>(
            new MergePartOfReferenceExistsOnlyInCoreNamespace()));


    describe('When_merge_exists_in_core', () => {
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartDomainEntity("Entity1")
                .withDocumentation("doc")
                .withIntegerIdentity("Prop1", "doc")
                .withEndDomainEntity()
                .withStartDomainEntity("Entity2")
                .withDocumentation("doc")
                .withIntegerIdentity("Prop1", "doc")
                .withReferenceProperty("Entity1", "doc", false, false)
                .withMergePartOfReference("Entity1.Prop1", "Prop1")
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_validate_successfully()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_merged_exists_in_extension', () => {
        const entityName1: string = "Entity1";
        const entityName2: string = "Entity2";
            const propertyName: string = "Prop1";
            const extensionNamespace: string = "extension";
let helper: ValidatorTestHelper = new ValidatorTestHelper();
before(() => {
    let metaEdText = MetaEdTextBuilder.build()

        .withBeginNamespace(extensionNamespace, "EXTENSION")
        .withStartDomainEntity(entityName1)
        .withDocumentation("doc")
        .withDecimalIdentity("Prop1", "doc", "5", "3")
        .withEndDomainEntity()

        .withStartDomainEntity(entityName2)
        .withDocumentation("doc")
        .withIntegerIdentity(propertyName, "doc")
        .withReferenceProperty(entityName1, "doc", false, false)
        .withMergePartOfReference(entityName1 + "." + propertyName, propertyName)
        .withEndDomainEntity()
        .withEndNamespace().toString();
    helper.setup(metaEdText, validatorListener);
});
it('should_have_validation_failures()', () => {
    helper.errorMessageCollection.length.should.equal(1);
});
it('should_have_meaningful_validation_message()', () => {
    helper.errorMessageCollection[0].Message.ShouldContain("'merge' is invalid for property");
    helper.errorMessageCollection[0].Message.ShouldContain(entityName1);
    helper.errorMessageCollection[0].Message.ShouldContain(entityName2);
    helper.errorMessageCollection[0].Message.ShouldContain(extensionNamespace);
    helper.errorMessageCollection[0].Message.ShouldContain("'merge' is only valid for properties on types in a core namespace.");
});
});
});