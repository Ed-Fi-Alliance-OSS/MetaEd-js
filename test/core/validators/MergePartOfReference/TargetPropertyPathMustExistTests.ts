//TODO: Part of property path unique pattern

///// <reference path="../../../../typings/index.d.ts" />
//import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
//import chai from 'chai'
//import {ValidatorTestHelper} from "../ValidatorTestHelper";
//import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
//import {TestRuleProvider} from "../TestRuleProvider";
//import {TargetPropertyPathMustExist}from "../../../../src/core/validators/MergePartOfReference/TargetPropertyPathMustExist"
//
////TODO: special case ?
//
//
//let should = chai.should();
//
//describe('TargetPropertyPathMustExistTests', () => {
//    let ruleProvider: IRuleProvider = helper.propertyPathLookup
//    let validatorListener = new ValidatorListener(
//        new TestRuleProvider<MetaEdGrammar.ReplaceMeWithContext>(
//            new TargetPropertyPathMustExist(helper.symbolTable, this._propertyPathLookup)));
//
//
//    describe('When_domain_entity_has_merge_property_and_path_is_wrong', () => {
//            private _propertyPathLookup: IPropertyPathLookup;
//    let helper: ValidatorTestHelper = new ValidatorTestHelper();
//    before(() => {
//        let metaEdText = MetaEdTextBuilder.build()
//
//            .withBeginNamespace("edfi")
//            .withStartDomainEntity("Entity2")
//            .withDocumentation("doc")
//            .withIntegerIdentity("Prop2", "doc")
//            .withReferenceProperty("Entity1", "doc", false, false)
//            .withMergePartOfReference("Entity1.Why", "This.Is.A.Test")
//            .withEndDomainEntity()
//            .withEndNamespace().toString();
//        helper.setup(metaEdText, validatorListener);
//    });
//            protected getRuleProvider(): IRuleProvider {
//        this._propertyPathLookup = MockRepository.GenerateStub<IPropertyPathLookup>();
//        this._propertyPathLookup.Stub(x => x.Validate(Arg<EntityContext> .Matches(y => y.Name == "Entity2"),
//            Arg.Is(new Array("This", "Is", "A", "Test")),
//            Arg<(_: IPropertyWithComponents) => boolean> .Is.NotNull)).Return(false);
//        return __init(new TestRuleProvider<MetaEdGrammar.TargetPropertyPathContext>(), { SuppliedRule: new TargetPropertyPathMustExist() }););
//            });
//it('should_have_validation_failures()', () => {
//    helper.errorMessageCollection.length.should.equal(1);
//});
//it('should_have_meaningful_validation_message()', () => {
//    helper.errorMessageCollection[0].Message.should.equal("Path This.Is.A.Test is not valid or lists properties that are not part of the primary key.");
//});
//});
//
//
//describe('When_domain_entity_has_merge_property', () => {
//            private _propertyPathLookup: IPropertyPathLookup;
//let helper: ValidatorTestHelper = new ValidatorTestHelper();
//before(() => {
//    let metaEdText = MetaEdTextBuilder.build()
//
//        .withBeginNamespace("edfi")
//        .withStartDomainEntity("Entity2")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop2", "doc")
//        .withReferenceProperty("Entity1", "doc", false, false)
//        .withMergePartOfReference("Entity1.Prop1", "This.Is.A.Test")
//        .withEndDomainEntity()
//        .withEndNamespace().toString();
//    helper.setup(metaEdText, validatorListener);
//});
//            protected getRuleProvider(): IRuleProvider {
//    this._propertyPathLookup = MockRepository.GenerateStub<IPropertyPathLookup>();
//    this._propertyPathLookup.Stub(x => x.Validate(Arg<EntityContext> .Matches(y => y.Name == "Entity2"),
//        Arg.Is(new Array("This", "Is", "A", "Test")),
//        Arg<(_: IPropertyWithComponents) => boolean> .Is.NotNull)).Return(true);
//    return __init(new TestRuleProvider<MetaEdGrammar.TargetPropertyPathContext>(), { SuppliedRule: new TargetPropertyPathMustExist(helper.symbolTable, this._propertyPathLookup) }););
//});
//it('should_have_no_validation_failures()', () => {
//    helper.errorMessageCollection.length.should.equal(0);
//});
//});
//
//
//describe('When_domain_entity_extension_has_merge_property', () => {
//            private _propertyPathLookup: IPropertyPathLookup;
//let helper: ValidatorTestHelper = new ValidatorTestHelper();
//before(() => {
//    let metaEdText = MetaEdTextBuilder.build()
//
//        .withBeginNamespace("edfi")
//        .withStartDomainEntity("Entity1")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop1", "doc")
//        .withEndDomainEntity()
//
//        .withStartDomainEntity("Entity2")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop2", "doc")
//        .withEndDomainEntity()
//
//        .withStartDomainEntityExtension("Entity2")
//        .withReferenceProperty("Entity1", "doc", false, false)
//        .withMergePartOfReference("Entity1.Prop1", "This.Is.A.Test")
//        .withEndDomainEntityExtension()
//        .withEndNamespace().toString();
//    helper.setup(metaEdText, validatorListener);
//});
//            protected getRuleProvider(): IRuleProvider {
//    this._propertyPathLookup = MockRepository.GenerateStub<IPropertyPathLookup>();
//    this._propertyPathLookup.Stub(x => x.Validate(Arg<EntityContext> .Matches(y => y.Name == "Entity2"),
//        Arg.Is(new Array("This", "Is", "A", "Test")),
//        Arg<(_: IPropertyWithComponents) => boolean> .Is.NotNull)).Return(true);
//    return __init(new TestRuleProvider<MetaEdGrammar.TargetPropertyPathContext>(), { SuppliedRule: new TargetPropertyPathMustExist(helper.symbolTable, this._propertyPathLookup) }););
//});
//it('should_have_no_validation_failures()', () => {
//    helper.errorMessageCollection.length.should.equal(0);
//});
//});
//
//
//describe('When_domain_entity_subclass_has_merge_property', () => {
//            private _propertyPathLookup: IPropertyPathLookup;
//let helper: ValidatorTestHelper = new ValidatorTestHelper();
//before(() => {
//    let metaEdText = MetaEdTextBuilder.build()
//
//        .withBeginNamespace("edfi")
//        .withStartDomainEntity("Entity1")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop1", "doc")
//        .withEndDomainEntity()
//
//        .withStartDomainEntity("Entity2")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop2", "doc")
//        .withEndDomainEntity()
//
//        .withStartDomainEntitySubclass("Entity3", "Entity2")
//        .withDocumentation("doc")
//        .withReferenceProperty("Entity1", "doc", false, false)
//        .withMergePartOfReference("Entity1.Prop1", "This.Is.A.Test")
//        .withEndDomainEntityExtension()
//        .withEndNamespace().toString();
//    helper.setup(metaEdText, validatorListener);
//});
//            protected getRuleProvider(): IRuleProvider {
//    this._propertyPathLookup = MockRepository.GenerateStub<IPropertyPathLookup>();
//    this._propertyPathLookup.Stub(x => x.Validate(Arg<EntityContext> .Matches(y => y.Name == "Entity2"),
//        Arg.Is(new Array("This", "Is", "A", "Test")),
//        Arg<(_: IPropertyWithComponents) => boolean> .Is.NotNull)).Return(true);
//    return __init(new TestRuleProvider<MetaEdGrammar.TargetPropertyPathContext>(), { SuppliedRule: new TargetPropertyPathMustExist(helper.symbolTable, this._propertyPathLookup) }););
//});
//it('should_have_no_validation_failures()', () => {
//    helper.errorMessageCollection.length.should.equal(0);
//});
//});
//
//
//describe('When_association_has_merge_property', () => {
//            private _propertyPathLookup: IPropertyPathLookup;
//let helper: ValidatorTestHelper = new ValidatorTestHelper();
//before(() => {
//    let metaEdText = MetaEdTextBuilder.build()
//
//        .withBeginNamespace("edfi")
//        .withStartDomainEntity("Entity1")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop1", "doc")
//        .withEndDomainEntity()
//
//        .withStartDomainEntity("Entity2")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop2", "doc")
//        .withEndDomainEntity()
//
//        .withStartDomainEntity("Entity3")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop3", "doc")
//        .withEndDomainEntity()
//
//        .withStartAssociation("Entity4")
//        .withDocumentation("doc")
//        .withDomainEntityProperty("Entity2", "doc")
//        .withDomainEntityProperty("Entity3", "doc")
//        .withIntegerIdentity("Prop4", "doc")
//        .withReferenceProperty("Entity1", "doc", false, false)
//        .withMergePartOfReference("Entity1.Prop1", "This.Is.A.Test")
//        .withEndAssociation()
//        .withEndNamespace().toString();
//    helper.setup(metaEdText, validatorListener);
//});
//            protected getRuleProvider(): IRuleProvider {
//    this._propertyPathLookup = MockRepository.GenerateStub<IPropertyPathLookup>();
//    this._propertyPathLookup.Stub(x => x.Validate(Arg<EntityContext> .Matches(y => y.Name == "Entity4"),
//        Arg.Is(new Array("This", "Is", "A", "Test")),
//        Arg<(_: IPropertyWithComponents) => boolean> .Is.NotNull)).Return(true);
//    return __init(new TestRuleProvider<MetaEdGrammar.TargetPropertyPathContext>(), { SuppliedRule: new TargetPropertyPathMustExist(helper.symbolTable, this._propertyPathLookup) }););
//});
//it('should_have_no_validation_failures()', () => {
//    helper.errorMessageCollection.length.should.equal(0);
//});
//});
//
//
//describe('When_association_extension_has_merge_property', () => {
//            private _propertyPathLookup: IPropertyPathLookup;
//let helper: ValidatorTestHelper = new ValidatorTestHelper();
//before(() => {
//    let metaEdText = MetaEdTextBuilder.build()
//
//        .withBeginNamespace("edfi")
//        .withStartDomainEntity("Entity1")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop1", "doc")
//        .withEndDomainEntity()
//
//        .withStartDomainEntity("Entity2")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop2", "doc")
//        .withEndDomainEntity()
//
//        .withStartDomainEntity("Entity3")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop3", "doc")
//        .withEndDomainEntity()
//
//        .withStartAssociation("Entity4")
//        .withDocumentation("doc")
//        .withDomainEntityProperty("Entity2", "doc")
//        .withDomainEntityProperty("Entity3", "doc")
//        .withIntegerIdentity("Prop4", "doc")
//        .withEndAssociation()
//
//        .withStartAssociationExtension("Entity4")
//        .withReferenceProperty("Entity1", "doc", false, false)
//        .withMergePartOfReference("Entity1.Prop1", "This.Is.A.Test")
//        .withEndNamespace().toString();
//    helper.setup(metaEdText, validatorListener);
//});
//            protected getRuleProvider(): IRuleProvider {
//    this._propertyPathLookup = MockRepository.GenerateStub<IPropertyPathLookup>();
//    this._propertyPathLookup.Stub(x => x.Validate(Arg<EntityContext> .Matches(y => y.Name == "Entity4"),
//        Arg.Is(new Array("This", "Is", "A", "Test")),
//        Arg<(_: IPropertyWithComponents) => boolean> .Is.NotNull)).Return(true);
//    return __init(new TestRuleProvider<MetaEdGrammar.TargetPropertyPathContext>(), { SuppliedRule: new TargetPropertyPathMustExist(helper.symbolTable, this._propertyPathLookup) }););
//});
//it('should_have_no_validation_failures()', () => {
//    helper.errorMessageCollection.length.should.equal(0);
//});
//});
//
//
//describe('When_association_subclass_has_merge_property', () => {
//            private _propertyPathLookup: IPropertyPathLookup;
//let helper: ValidatorTestHelper = new ValidatorTestHelper();
//before(() => {
//    let metaEdText = MetaEdTextBuilder.build()
//
//        .withBeginNamespace("edfi")
//        .withStartDomainEntity("Entity1")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop1", "doc")
//        .withEndDomainEntity()
//
//        .withStartDomainEntity("Entity2")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop2", "doc")
//        .withEndDomainEntity()
//
//        .withStartDomainEntity("Entity3")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop3", "doc")
//        .withEndDomainEntity()
//
//        .withStartAssociation("Entity4")
//        .withDocumentation("doc")
//        .withDomainEntityProperty("Entity2", "doc")
//        .withDomainEntityProperty("Entity3", "doc")
//        .withIntegerIdentity("Prop4", "doc")
//        .withEndAssociation()
//
//        .withStartAssociationSubclass("Entity5", "Entity4")
//        .withDocumentation("doc")
//        .withReferenceProperty("Entity1", "doc", false, false)
//        .withMergePartOfReference("Entity1.Prop1", "This.Is.A.Test")
//        .withEndNamespace().toString();
//    helper.setup(metaEdText, validatorListener);
//});
//            protected getRuleProvider(): IRuleProvider {
//    this._propertyPathLookup = MockRepository.GenerateStub<IPropertyPathLookup>();
//    this._propertyPathLookup.Stub(x => x.Validate(Arg<EntityContext> .Matches(y => y.Name == "Entity4"),
//        Arg.Is(new Array("This", "Is", "A", "Test")),
//        Arg<(_: IPropertyWithComponents) => boolean> .Is.NotNull)).Return(true);
//    return __init(new TestRuleProvider<MetaEdGrammar.TargetPropertyPathContext>(), { SuppliedRule: new TargetPropertyPathMustExist(helper.symbolTable, this._propertyPathLookup) }););
//});
//it('should_have_no_validation_failures()', () => {
//    helper.errorMessageCollection.length.should.equal(0);
//});
//});
//
//
//describe('When_abstract_has_merge_property', () => {
//            private _propertyPathLookup: IPropertyPathLookup;
//let helper: ValidatorTestHelper = new ValidatorTestHelper();
//before(() => {
//    let metaEdText = MetaEdTextBuilder.build()
//
//        .withBeginNamespace("edfi")
//        .withStartAbstractEntity("Entity2")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop2", "doc")
//        .withReferenceProperty("Entity1", "doc", false, false)
//        .withMergePartOfReference("Entity1.Prop1", "This.Is.A.Test")
//        .withEndAbstractEntity()
//        .withEndNamespace().toString();
//    helper.setup(metaEdText, validatorListener);
//});
//            protected getRuleProvider(): IRuleProvider {
//    this._propertyPathLookup = MockRepository.GenerateStub<IPropertyPathLookup>();
//    this._propertyPathLookup.Stub(x => x.Validate(Arg<EntityContext> .Matches(y => y.Name == "Entity2"),
//        Arg.Is(new Array("This", "Is", "A", "Test")),
//        Arg<(_: IPropertyWithComponents) => boolean> .Is.NotNull)).Return(true);
//    return __init(new TestRuleProvider<MetaEdGrammar.TargetPropertyPathContext>(), { SuppliedRule: new TargetPropertyPathMustExist(helper.symbolTable, this._propertyPathLookup) }););
//});
//it('should_have_no_validation_failures()', () => {
//    helper.errorMessageCollection.length.should.equal(0);
//});
//});
//});