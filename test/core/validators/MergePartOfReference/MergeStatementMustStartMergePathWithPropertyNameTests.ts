import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import {ValidatorTestHelper} from "../ValidatorTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {MergeStatementMustStartMergePathWithPropertyName}from "../../../../src/core/validators/MergePartOfReference/MergeStatementMustStartMergePathWithPropertyName"

let should = chai.should();

describe('MergeStatementMustStartMergePathWithPropertyName', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.MergePartOfReferenceContext>(
            new MergeStatementMustStartMergePathWithPropertyName()));


    describe('When_reference_property_has_merge_statement_with_correct_path', () => {
        let entityName: string = "MyIdentifier";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartDomainEntity("DomainEntity2")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withReferenceProperty(entityName, "doc", true, false)
                .withMergePartOfReference(entityName + ".Property", "AnotherProperty")
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_reference_property_has_merge_statement_with_incorrect_path', () => {
        let entityName: string = "MyIdentifier";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartDomainEntity("DomainEntity2")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withReferenceProperty(entityName, "doc", true, false)
                .withMergePartOfReference("DifferentEntity.Property", "AnotherProperty")
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(1);
            helper.errorMessageCollection[0].Message.should.equal("Merge statement must start first property path with the referenced entity name of the current property.");
        });
    });
});