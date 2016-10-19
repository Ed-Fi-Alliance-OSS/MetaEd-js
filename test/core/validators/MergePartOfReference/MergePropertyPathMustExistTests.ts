//TODO: Part of property path unique pattern

////import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
//import chai from 'chai'
//import {ValidatorTestHelper} from "../ValidatorTestHelper";
//import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
//import {InsertClassName}from "../../../../src/core/validators/EnterFolderName/EnterClassName"
//
//let should = chai.should();
////TODO: special case?
//
//describe('MergePropertyPathMustExist', () => {
//
//    describe('When_domain_entity_has_merge_property_and_path_is_wrong', () => {
//            private _propertyPathLookup: IPropertyPathLookup;
//    let helper: ValidatorTestHelper = new ValidatorTestHelper();
//
//    before(() => {
//        let metaEdText = MetaEdTextBuilder.build()
//
//            .withBeginNamespace("edfi")
//            .withStartDomainEntity("Entity1")
//            .withDocumentation("doc")
//            .withIntegerIdentity("Prop1", "doc")
//            .withEndDomainEntity()
//
//            .withStartDomainEntity("Entity2")
//            .withDocumentation("doc")
//            .withIntegerIdentity("Prop2", "doc")
//            .withReferenceProperty("Entity1", "doc", false, false)
//            .withMergePartOfReference("Entity1.Why", "Prop2")
//            .withEndDomainEntity()
//            .withEndNamespace().toString();
//        helper.setup(metaEdText, validatorListener);
//    });
//
//    let propertyPathLookup = MockRepository.GenerateStub<IPropertyPathLookup>();
//    propertyPathLookup.Stub(x => x.Validate(Arg<EntityContext> .Matches(y => y.Name == "Entity2"),
//        Arg.Is(new Array("Entity1", "Why")),
//        Arg<(_: IPropertyWithComponents) => boolean> .Is.NotNull)).Return(false);
//    let validatorListener = new ValidatorListener(new TestRuleProvider<MetaEdGrammar.MergePropertyPathContext>(new MergePropertyPathMustExist(helper.symbolTable, this._propertyPathLookup)));
//
//    it('should_have_validation_failures()', () => {
//        helper.errorMessageCollection.length.should.equal(1);
//    });
//    it('should_have_meaningful_validation_message()', () => {
//        helper.errorMessageCollection[0].Message.should.equal("Path Entity1.Why is not valid.");
//    });
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
//        .withStartDomainEntity("Entity1")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop1", "doc")
//        .withEndDomainEntity()
//
//        .withStartDomainEntity("Entity2")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop2", "doc")
//        .withReferenceProperty("Entity1", "doc", false, false)
//        .withMergePartOfReference("Entity1.Prop1", "Prop2")
//        .withEndDomainEntity()
//        .withEndNamespace().toString();
//    helper.setup(metaEdText, validatorListener);
//});
//
//let propertyPathLookup = MockRepository.GenerateStub<IPropertyPathLookup>();
//propertyPathLookup.Stub(x => x.Validate(Arg<EntityContext> .Matches(y => y.Name == "Entity2"),
//    Arg.Is(new Array("Entity1", "Prop1")),
//    Arg<(_: IPropertyWithComponents) => boolean> .Is.NotNull)).Return(true);
//let validatorListener = new ValidatorListener(new TestRuleProvider<MetaEdGrammar.MergePropertyPathContext>(new MergePropertyPathMustExist(helper.symbolTable, this._propertyPathLookup)));
//
//
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
//        .withMergePartOfReference("Entity1.Prop1", "Prop2")
//        .withEndDomainEntityExtension()
//        .withEndNamespace().toString();
//    helper.setup(metaEdText, validatorListener);
//});
//
//let propertyPathLookup = MockRepository.GenerateStub<IPropertyPathLookup>();
//propertyPathLookup.Stub(x => x.Validate(Arg<EntityContext> .Matches(y => y.Name == "Entity2"),
//    Arg.Is(new Array("Entity1", "Prop1")),
//    Arg<(_: IPropertyWithComponents) => boolean> .Is.NotNull)).Return(true);
//let validatorListener = new ValidatorListener(new TestRuleProvider<MetaEdGrammar.MergePropertyPathContext>(new MergePropertyPathMustExist(helper.symbolTable, this._propertyPathLookup)));
//
//
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
//        .withMergePartOfReference("Entity1.Prop1", "Prop2")
//        .withEndDomainEntityExtension()
//        .withEndNamespace().toString();
//    helper.setup(metaEdText, validatorListener);
//});
//
//let propertyPathLookup = MockRepository.GenerateStub<IPropertyPathLookup>();
//propertyPathLookup.Stub(x => x.Validate(Arg<EntityContext> .Matches(y => y.Name == "Entity3"),
//    Arg.Is(new Array("Entity1", "Prop1")),
//    Arg<(_: IPropertyWithComponents) => boolean> .Is.NotNull)).Return(true);
//let validatorListener = new ValidatorListener(new TestRuleProvider<MetaEdGrammar.MergePropertyPathContext>(new MergePropertyPathMustExist(helper.symbolTable, this._propertyPathLookup)));
//
//
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
//        .withMergePartOfReference("Entity1.Prop1", "Prop4")
//        .withEndAssociation()
//        .withEndNamespace().toString();
//    helper.setup(metaEdText, validatorListener);
//});
//
//let propertyPathLookup = MockRepository.GenerateStub<IPropertyPathLookup>();
//propertyPathLookup.Stub(x => x.Validate(Arg<EntityContext> .Matches(y => y.Name == "Entity4"),
//    Arg.Is(new Array("Entity1", "Prop1")),
//    Arg<(_: IPropertyWithComponents) => boolean> .Is.NotNull)).Return(true);
//let validatorListener = new ValidatorListener(new TestRuleProvider<MetaEdGrammar.MergePropertyPathContext>(new MergePropertyPathMustExist(helper.symbolTable, this._propertyPathLookup)));
//
//
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
//        .withMergePartOfReference("Entity1.Prop1", "Prop4")
//        .withEndNamespace().toString();
//    helper.setup(metaEdText, validatorListener);
//});
//
//let propertyPathLookup = MockRepository.GenerateStub<IPropertyPathLookup>();
//propertyPathLookup.Stub(x => x.Validate(Arg<EntityContext> .Matches(y => y.Name == "Entity4"),
//    Arg.Is(new Array("Entity1", "Prop1")),
//    Arg<(_: IPropertyWithComponents) => boolean> .Is.NotNull)).Return(true);
//let validatorListener = new ValidatorListener(new TestRuleProvider<MetaEdGrammar.MergePropertyPathContext>(new MergePropertyPathMustExist(helper.symbolTable, this._propertyPathLookup)));
//
//
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
//        .withMergePartOfReference("Entity1.Prop1", "Prop4")
//        .withEndNamespace().toString();
//    helper.setup(metaEdText, validatorListener);
//});
//
//let propertyPathLookup = MockRepository.GenerateStub<IPropertyPathLookup>();
//propertyPathLookup.Stub(x => x.Validate(Arg<EntityContext> .Matches(y => y.Name == "Entity5"),
//    Arg.Is(new Array("Entity1", "Prop1")),
//    Arg<(_: IPropertyWithComponents) => boolean> .Is.NotNull)).Return(true);
//let validatorListener = new ValidatorListener(new TestRuleProvider<MetaEdGrammar.MergePropertyPathContext>(new MergePropertyPathMustExist(helper.symbolTable, this._propertyPathLookup)));
//
//
//it('should_have_no_validation_failures()', () => {
//    helper.errorMessageCollection.length.should.equal(0);
//});
//});
//
//
//describe('When_abstract_entity_has_merge_property', () => {
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
//        .withStartAbstractEntity("Entity2")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop2", "doc")
//        .withReferenceProperty("Entity1", "doc", false, false)
//        .withMergePartOfReference("Entity1.Prop1", "Prop2")
//        .withEndAbstractEntity()
//        .withEndNamespace().toString();
//    helper.setup(metaEdText, validatorListener);
//});
//
//let propertyPathLookup = MockRepository.GenerateStub<IPropertyPathLookup>();
//propertyPathLookup.Stub(x => x.Validate(Arg<EntityContext> .Matches(y => y.Name == "Entity2"),
//    Arg.Is(new Array("Entity1", "Prop1")),
//    Arg<(_: IPropertyWithComponents) => boolean> .Is.NotNull)).Return(true);
//let validatorListener = new ValidatorListener(new TestRuleProvider<MetaEdGrammar.MergePropertyPathContext>(new MergePropertyPathMustExist(helper.symbolTable, this._propertyPathLookup)));
//
//it('should_have_no_validation_failures()', () => {
//    helper.errorMessageCollection.length.should.equal(0);
//});
//});
//});