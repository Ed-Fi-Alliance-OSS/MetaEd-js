"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidatorTestHelper_1 = require("../ValidatorTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const MergePropertyAndTargetPropertyMustMatch_1 = require("../../../../src/core/validators/MergePartOfReference/MergePropertyAndTargetPropertyMustMatch");
const PropertyPathLookup_1 = require("../../../../src/core/validators/MergePartOfReference/PropertyPathLookup");
let should = chai.should();
//TODO: special case?
let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new MergePropertyAndTargetPropertyMustMatch_1.MergePropertyAndTargetPropertyMustMatch(helper.symbolTable, new PropertyPathLookup_1.PropertyPathLookup(helper.symbolTable))));
describe('MergePropertyAndTargetPropertyMustMatch', () => {
    describe('When_merged_property_names_and_types_match', () => {
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
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
    describe('When_merged_property_types_are_different', () => {
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity("Entity1")
                .withDocumentation("doc")
                .withDecimalIdentity("Prop1", "doc", 5, 3)
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
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(1);
        });
        it('should_have_meaningful_validation_message()', () => {
            helper.errorMessageCollection[0].Message.should.equal("The merge paths 'Entity1.Prop1' and 'Prop1' do not correspond to the same entity type.");
        });
    });
    describe('When_merged_property_names_are_different', () => {
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity("Entity1")
                .withDocumentation("doc")
                .withIntegerIdentity("Prop1", "doc")
                .withEndDomainEntity()
                .withStartDomainEntity("Entity2")
                .withDocumentation("doc")
                .withIntegerIdentity("Prop2", "doc")
                .withReferenceProperty("Entity1", "doc", false, false)
                .withMergePartOfReference("Entity1.Prop1", "Prop2")
                .withEndDomainEntity()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(1);
        });
    });
    describe('When_merging_properties_of_a_base_and_sub_domain_entity', () => {
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity("Entity1")
                .withDocumentation("doc")
                .withIntegerIdentity("Prop1", "doc")
                .withEndDomainEntity()
                .withStartDomainEntitySubclass("Entity2", "Entity1")
                .withDocumentation("doc")
                .withIntegerProperty("Prop2", "doc", false, false)
                .withEndDomainEntity()
                .withStartDomainEntity("Entity3")
                .withDocumentation("doc")
                .withReferenceProperty("Entity1", "doc", false, false)
                .withMergePartOfReference("Entity1", "Entity2")
                .withReferenceProperty("Entity2", "doc", false, false)
                .withEndDomainEntityExtension()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_validate_successfully()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
    describe('When_merging_domain_entity_property_of_an_association', () => {
        let helper = new ValidatorTestHelper_1.ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity("Entity1")
                .withDocumentation("doc")
                .withIntegerIdentity("Prop1", "doc")
                .withEndDomainEntity()
                .withStartDomainEntity("Entity2")
                .withDocumentation("doc")
                .withReferenceIdentity("Entity1", "doc")
                .withEndDomainEntity()
                .withStartDomainEntity("Entity3")
                .withDocumentation("doc")
                .withIntegerIdentity("Prop3", "doc")
                .withEndDomainEntity()
                .withStartAssociation("Entity4")
                .withDocumentation("doc")
                .withDomainEntityProperty("Entity2", "doc")
                .withDomainEntityProperty("Entity3", "doc")
                .withIntegerIdentity("Prop4", "doc")
                .withReferenceProperty("Entity1", "doc", false, false)
                .withMergePartOfReference("Entity1", "Entity2.Entity1")
                .withEndAssociation()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_validate_successfully()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });
});
//# sourceMappingURL=MergePropertyAndTargetPropertyMustMatchTests.js.map