"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
//TODO: special case ?
let should = chai.should();
describe('ReplaceMeWithFileName', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new ReplaceMeWithFileName()));
    describe('When_domain_entity_has_merge_property_and_path_is_wrong', () => { }, private, _propertyPathLookup, IPropertyPathLookup);
    let helper = new ValidationTestHelper_1.ValidationTestHelper();
    before(() => {
        let metaEdText = MetaEdTextBuilder_1.default.buildIt
            .withBeginNamespace("edfi")
            .withStartDomainEntity("Entity2")
            .withDocumentation("doc")
            .withIntegerIdentity("Prop2", "doc")
            .withReferenceProperty("Entity1", "doc", false, false)
            .withMergePartOfReference("Entity1.Why", "This.Is.A.Test")
            .withEndDomainEntity()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
}, protected, getRuleProvider(), IRuleProvider, {
    this: ._propertyPathLookup = MockRepository.GenerateStub(),
    this: ._propertyPathLookup.Stub(x => x.Validate(Arg(Matches(y => y.Name == "Entity2"), Arg.Is(new Array("This", "Is", "A", "Test")), Arg(Is.NotNull)).Return(false))),
    return: __init(new TestRuleProvider_1.TestRuleProvider(), { SuppliedRule: new TargetPropertyPathMustExist(helper.symbolTable, this._propertyPathLookup) }) });
;
it('should_have_validation_failures()', () => {
    helper.errorMessageCollection.Count.ShouldEqual(1);
});
it('should_have_meaningful_validation_message()', () => {
    helper.errorMessageCollection[0].Message.ShouldEqual("Path This.Is.A.Test is not valid or lists properties that are not part of the primary key.");
});
;
describe('When_domain_entity_has_merge_property', () => { }, private, _propertyPathLookup, IPropertyPathLookup);
let helper = new ValidationTestHelper_1.ValidationTestHelper();
before(() => {
    let metaEdText = MetaEdTextBuilder_1.default.buildIt
        .withBeginNamespace("edfi")
        .withStartDomainEntity("Entity2")
        .withDocumentation("doc")
        .withIntegerIdentity("Prop2", "doc")
        .withReferenceProperty("Entity1", "doc", false, false)
        .withMergePartOfReference("Entity1.Prop1", "This.Is.A.Test")
        .withEndDomainEntity()
        .withEndNamespace();
    helper.setup(metaEdText, validatorListener);
});
getRuleProvider();
IRuleProvider;
{
    this._propertyPathLookup = MockRepository.GenerateStub();
    this._propertyPathLookup.Stub(x => x.Validate(Arg(Matches(y => y.Name == "Entity2"), Arg.Is(new Array("This", "Is", "A", "Test")), Arg(Is.NotNull)).Return(true)));
    return __init(new TestRuleProvider_1.TestRuleProvider(), { SuppliedRule: new TargetPropertyPathMustExist(helper.symbolTable, this._propertyPathLookup) });
    ;
}
;
it('should_have_no_validation_failures()', () => {
    helper.errorMessageCollection.Count.ShouldEqual(0);
});
;
describe('When_domain_entity_extension_has_merge_property', () => { }, private, _propertyPathLookup, IPropertyPathLookup);
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
        .withEndDomainEntity()
        .withStartDomainEntityExtension("Entity2")
        .withReferenceProperty("Entity1", "doc", false, false)
        .withMergePartOfReference("Entity1.Prop1", "This.Is.A.Test")
        .withEndDomainEntityExtension()
        .withEndNamespace();
    helper.setup(metaEdText, validatorListener);
});
getRuleProvider();
IRuleProvider;
{
    this._propertyPathLookup = MockRepository.GenerateStub();
    this._propertyPathLookup.Stub(x => x.Validate(Arg(Matches(y => y.Name == "Entity2"), Arg.Is(new Array("This", "Is", "A", "Test")), Arg(Is.NotNull)).Return(true)));
    return __init(new TestRuleProvider_1.TestRuleProvider(), { SuppliedRule: new TargetPropertyPathMustExist(helper.symbolTable, this._propertyPathLookup) });
    ;
}
;
it('should_have_no_validation_failures()', () => {
    helper.errorMessageCollection.Count.ShouldEqual(0);
});
;
describe('When_domain_entity_subclass_has_merge_property', () => { }, private, _propertyPathLookup, IPropertyPathLookup);
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
        .withEndDomainEntity()
        .withStartDomainEntitySubclass("Entity3", "Entity2")
        .withDocumentation("doc")
        .withReferenceProperty("Entity1", "doc", false, false)
        .withMergePartOfReference("Entity1.Prop1", "This.Is.A.Test")
        .withEndDomainEntityExtension()
        .withEndNamespace();
    helper.setup(metaEdText, validatorListener);
});
getRuleProvider();
IRuleProvider;
{
    this._propertyPathLookup = MockRepository.GenerateStub();
    this._propertyPathLookup.Stub(x => x.Validate(Arg(Matches(y => y.Name == "Entity2"), Arg.Is(new Array("This", "Is", "A", "Test")), Arg(Is.NotNull)).Return(true)));
    return __init(new TestRuleProvider_1.TestRuleProvider(), { SuppliedRule: new TargetPropertyPathMustExist(helper.symbolTable, this._propertyPathLookup) });
    ;
}
;
it('should_have_no_validation_failures()', () => {
    helper.errorMessageCollection.Count.ShouldEqual(0);
});
;
describe('When_association_has_merge_property', () => { }, private, _propertyPathLookup, IPropertyPathLookup);
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
        .withMergePartOfReference("Entity1.Prop1", "This.Is.A.Test")
        .withEndAssociation()
        .withEndNamespace();
    helper.setup(metaEdText, validatorListener);
});
getRuleProvider();
IRuleProvider;
{
    this._propertyPathLookup = MockRepository.GenerateStub();
    this._propertyPathLookup.Stub(x => x.Validate(Arg(Matches(y => y.Name == "Entity4"), Arg.Is(new Array("This", "Is", "A", "Test")), Arg(Is.NotNull)).Return(true)));
    return __init(new TestRuleProvider_1.TestRuleProvider(), { SuppliedRule: new TargetPropertyPathMustExist(helper.symbolTable, this._propertyPathLookup) });
    ;
}
;
it('should_have_no_validation_failures()', () => {
    helper.errorMessageCollection.Count.ShouldEqual(0);
});
;
describe('When_association_extension_has_merge_property', () => { }, private, _propertyPathLookup, IPropertyPathLookup);
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
        .withEndAssociation()
        .withStartAssociationExtension("Entity4")
        .withReferenceProperty("Entity1", "doc", false, false)
        .withMergePartOfReference("Entity1.Prop1", "This.Is.A.Test")
        .withEndNamespace();
    helper.setup(metaEdText, validatorListener);
});
getRuleProvider();
IRuleProvider;
{
    this._propertyPathLookup = MockRepository.GenerateStub();
    this._propertyPathLookup.Stub(x => x.Validate(Arg(Matches(y => y.Name == "Entity4"), Arg.Is(new Array("This", "Is", "A", "Test")), Arg(Is.NotNull)).Return(true)));
    return __init(new TestRuleProvider_1.TestRuleProvider(), { SuppliedRule: new TargetPropertyPathMustExist(helper.symbolTable, this._propertyPathLookup) });
    ;
}
;
it('should_have_no_validation_failures()', () => {
    helper.errorMessageCollection.Count.ShouldEqual(0);
});
;
describe('When_association_subclass_has_merge_property', () => { }, private, _propertyPathLookup, IPropertyPathLookup);
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
        .withEndAssociation()
        .withStartAssociationSubclass("Entity5", "Entity4")
        .withDocumentation("doc")
        .withReferenceProperty("Entity1", "doc", false, false)
        .withMergePartOfReference("Entity1.Prop1", "This.Is.A.Test")
        .withEndNamespace();
    helper.setup(metaEdText, validatorListener);
});
getRuleProvider();
IRuleProvider;
{
    this._propertyPathLookup = MockRepository.GenerateStub();
    this._propertyPathLookup.Stub(x => x.Validate(Arg(Matches(y => y.Name == "Entity4"), Arg.Is(new Array("This", "Is", "A", "Test")), Arg(Is.NotNull)).Return(true)));
    return __init(new TestRuleProvider_1.TestRuleProvider(), { SuppliedRule: new TargetPropertyPathMustExist(helper.symbolTable, this._propertyPathLookup) });
    ;
}
;
it('should_have_no_validation_failures()', () => {
    helper.errorMessageCollection.Count.ShouldEqual(0);
});
;
describe('When_abstract_has_merge_property', () => { }, private, _propertyPathLookup, IPropertyPathLookup);
let helper = new ValidationTestHelper_1.ValidationTestHelper();
before(() => {
    let metaEdText = MetaEdTextBuilder_1.default.buildIt
        .withBeginNamespace("edfi")
        .withStartAbstractEntity("Entity2")
        .withDocumentation("doc")
        .withIntegerIdentity("Prop2", "doc")
        .withReferenceProperty("Entity1", "doc", false, false)
        .withMergePartOfReference("Entity1.Prop1", "This.Is.A.Test")
        .withEndAbstractEntity()
        .withEndNamespace();
    helper.setup(metaEdText, validatorListener);
});
getRuleProvider();
IRuleProvider;
{
    this._propertyPathLookup = MockRepository.GenerateStub();
    this._propertyPathLookup.Stub(x => x.Validate(Arg(Matches(y => y.Name == "Entity2"), Arg.Is(new Array("This", "Is", "A", "Test")), Arg(Is.NotNull)).Return(true)));
    return __init(new TestRuleProvider_1.TestRuleProvider(), { SuppliedRule: new TargetPropertyPathMustExist(helper.symbolTable, this._propertyPathLookup) });
    ;
}
;
it('should_have_no_validation_failures()', () => {
    helper.errorMessageCollection.Count.ShouldEqual(0);
});
;
;
//# sourceMappingURL=TargetPropertyPathMustExistTests.js.map