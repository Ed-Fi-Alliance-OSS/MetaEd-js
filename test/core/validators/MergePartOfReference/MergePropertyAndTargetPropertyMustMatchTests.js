"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
let should = chai.should();
//TODO: special case?
describe('MergePropertyAndTargetPropertyMustMatch', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new MergePropertyAndTargetPropertyMustMatch(helper.symbolTable, propertyPathLookup)));
    describe('When_merged_property_names_and_types_match', () => {
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
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
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
    }, protected, getRuleProvider(), IRuleProvider, {
        let: propertyPathLookup = new PropertyPathLookup(helper.symbolTable),
        return: __init(new TestRuleProvider_1.TestRuleProvider(), { SuppliedRule: new MergePropertyAndTargetPropertyMustMatch(helper.symbolTable, propertyPathLookup) }) });
});
it('should_validate_successfully()', () => {
    helper.errorMessageCollection.Count.ShouldEqual(0);
});
;
describe('When_merged_property_types_are_different', () => {
    let helper = new ValidationTestHelper_1.ValidationTestHelper();
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
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
}, protected, getRuleProvider(), IRuleProvider, {
    let: propertyPathLookup = new PropertyPathLookup(helper.symbolTable),
    return: __init(new TestRuleProvider_1.TestRuleProvider(), { SuppliedRule: new MergePropertyAndTargetPropertyMustMatch(helper.symbolTable, propertyPathLookup) }) });
;
it('should_have_validation_failures()', () => {
    helper.errorMessageCollection.Count.ShouldEqual(1);
});
it('should_have_meaningful_validation_message()', () => {
    helper.errorMessageCollection[0].Message.ShouldEqual("The merge paths 'Entity1.Prop1' and 'Prop1' do not correspond to the same entity type.");
});
;
describe('When_merged_property_names_are_different', () => {
    let helper = new ValidationTestHelper_1.ValidationTestHelper();
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
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
}, protected, getRuleProvider(), IRuleProvider, {
    let: propertyPathLookup = new PropertyPathLookup(helper.symbolTable),
    return: __init(new TestRuleProvider_1.TestRuleProvider(), { SuppliedRule: new MergePropertyAndTargetPropertyMustMatch(helper.symbolTable, propertyPathLookup) }) });
;
it('should_have_validation_failures()', () => {
    helper.errorMessageCollection.Count.ShouldEqual(1);
});
;
describe('When_merging_properties_of_a_base_and_sub_domain_entity', () => {
    let helper = new ValidationTestHelper_1.ValidationTestHelper();
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
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
}, protected, getRuleProvider(), IRuleProvider, {
    let: propertyPathLookup = new PropertyPathLookup(helper.symbolTable),
    return: __init(new TestRuleProvider_1.TestRuleProvider(), { SuppliedRule: new MergePropertyAndTargetPropertyMustMatch(helper.symbolTable, propertyPathLookup) }) });
;
it('should_validate_successfully()', () => {
    helper.errorMessageCollection.Count.ShouldEqual(0);
});
;
describe('When_merging_domain_entity_property_of_an_association', () => {
    let helper = new ValidationTestHelper_1.ValidationTestHelper();
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
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
}, protected, getRuleProvider(), IRuleProvider, {
    let: propertyPathLookup = new PropertyPathLookup(helper.symbolTable),
    return: __init(new TestRuleProvider_1.TestRuleProvider(), { SuppliedRule: new MergePropertyAndTargetPropertyMustMatch(helper.symbolTable, propertyPathLookup) }) });
;
it('should_validate_successfully()', () => {
    helper.errorMessageCollection.Count.ShouldEqual(0);
});
;
;
//# sourceMappingURL=MergePropertyAndTargetPropertyMustMatchTests.js.map