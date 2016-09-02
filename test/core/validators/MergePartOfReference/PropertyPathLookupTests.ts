//TODO: Part of property path unique pattern

///// <reference path="../../../../typings/index.d.ts" />
//import chai = require('chai');
//import {ValidatorTestHelper} from "../ValidatorTestHelper";
//
//let should = chai.should();
//
////TODO: special case?
//
//describe('ReplaceMeWithFileName', () => {
//    let validatorListener = new ValidatorListener(
//        new TestRuleProvider<MetaEdGrammar.ReplaceMeWithContext>(
//            new ReplaceMeWithFileName()));
//
//    describe('PropertyPathLookupTestBase extends BaseValidationTest {
//            protected _result: IContextWithIdentifier;
//            protected getPathToTest(): string[] { throw new Error('not implemented'); });
//            protected getEntityContextToTest(): EntityContext { throw new Error('not implemented'); });
//            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean { throw new Error('not implemented'); });
//            protected setupPostBuilder(): void {
//    let propertyPathLookup = new PropertyPathLookup(_symbolTable);
//    this._result = propertyPathLookup.FindReferencedProperty(GetEntityContextToTest(), GetPathToTest(), GetFilterToTest());
//});
//});
//
//
//describe('When_looking_for_property_on_current_entity extends PropertyPathLookupTestBase {
//            let helper: ValidatorTestHelper = new ValidatorTestHelper();
//before(() => {
//    let metaEdText = MetaEdTextBuilder.buildIt
//
//        .withBeginNamespace("edfi")
//        .withStartDomainEntity("Entity1")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop1", "doc")
//        .withEndDomainEntity()
//        .withEndNamespace().toString();
//    helper.setup(metaEdText, validatorListener);
//});
//            protected getPathToTest(): string[] {
//    return new Array("Prop1");
//});
//            protected getEntityContextToTest(): EntityContext {
//    return _symbolTable.Get(this.symbolTableEntityType.domainEntityEntityType(), "Entity1");
//});
//            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean {
//    return PropertyPathLookup.MatchAllIdentityProperties();
//});
//it('should_return_expected_property(): void {
//                this._result.ShouldNotBeNull();
//this._result.IdNode().GetText().should.equal("Prop1");
//            });
//});
//
//
//describe('When_looking_for_first_domain_entity_on_association extends PropertyPathLookupTestBase {
//            let helper: ValidatorTestHelper = new ValidatorTestHelper();
//before(() => {
//    let metaEdText = MetaEdTextBuilder.buildIt
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
//        .withStartAssociation("Entity3")
//        .withDocumentation("doc")
//        .withDomainEntityProperty("Entity1", "doc")
//        .withDomainEntityProperty("Entity2", "doc")
//        .withEndAssociation()
//        .withEndNamespace().toString();
//    helper.setup(metaEdText, validatorListener);
//});
//            protected getPathToTest(): string[] {
//    return new Array("Entity1");
//});
//            protected getEntityContextToTest(): EntityContext {
//    return _symbolTable.Get(this.symbolTableEntityType.associationEntityType(), "Entity3");
//});
//            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean {
//    return PropertyPathLookup.MatchAllIdentityProperties();
//});
//it('should_return_expected_property(): void {
//                this._result.ShouldNotBeNull();
//this._result.IdNode().GetText().should.equal("Entity1");
//            });
//});
//
//
//describe('When_looking_for_second_domain_entity_on_association extends PropertyPathLookupTestBase {
//            let helper: ValidatorTestHelper = new ValidatorTestHelper();
//before(() => {
//    let metaEdText = MetaEdTextBuilder.buildIt
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
//        .withStartAssociation("Entity3")
//        .withDocumentation("doc")
//        .withDomainEntityProperty("Entity1", "doc")
//        .withDomainEntityProperty("Entity2", "doc")
//        .withEndAssociation()
//        .withEndNamespace().toString();
//    helper.setup(metaEdText, validatorListener);
//});
//            protected getPathToTest(): string[] {
//    return new Array("Entity2");
//});
//            protected getEntityContextToTest(): EntityContext {
//    return _symbolTable.Get(this.symbolTableEntityType.associationEntityType(), "Entity3");
//});
//            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean {
//    return PropertyPathLookup.MatchAllIdentityProperties();
//});
//it('should_return_expected_property(): void {
//                this._result.ShouldNotBeNull();
//this._result.IdNode().GetText().should.equal("Entity2");
//            });
//});
//
//
//describe('When_looking_for_non_identity_property_on_current_entity extends PropertyPathLookupTestBase {
//            let helper: ValidatorTestHelper = new ValidatorTestHelper();
//before(() => {
//    let metaEdText = MetaEdTextBuilder.buildIt
//
//        .withBeginNamespace("edfi")
//        .withStartDomainEntity("Entity1")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop1", "doc")
//        .withIntegerProperty("Prop2", "doc", true, false)
//        .withEndDomainEntity()
//        .withEndNamespace().toString();
//    helper.setup(metaEdText, validatorListener);
//});
//            protected getPathToTest(): string[] {
//    return new Array("Prop2");
//});
//            protected getEntityContextToTest(): EntityContext {
//    return _symbolTable.Get(this.symbolTableEntityType.domainEntityEntityType(), "Entity1");
//});
//            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean {
//    return PropertyPathLookup.MatchAllIdentityProperties();
//});
//it('should_return_null(): void {
//                this._result.ShouldBeNull();
//            });
//});
//
//
//describe('When_looking_for_property_that_does_not_exist extends PropertyPathLookupTestBase {
//            let helper: ValidatorTestHelper = new ValidatorTestHelper();
//before(() => {
//    let metaEdText = MetaEdTextBuilder.buildIt
//
//        .withBeginNamespace("edfi")
//        .withStartDomainEntity("Entity1")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop1", "doc")
//        .withIntegerProperty("Prop2", "doc", true, false)
//        .withEndDomainEntity()
//        .withEndNamespace().toString();
//    helper.setup(metaEdText, validatorListener);
//});
//            protected getPathToTest(): string[] {
//    return new Array("Prop3");
//});
//            protected getEntityContextToTest(): EntityContext {
//    return _symbolTable.Get(this.symbolTableEntityType.domainEntityEntityType(), "Entity1");
//});
//            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean {
//    return PropertyPathLookup.MatchAllIdentityProperties();
//});
//it('should_return_null(): void {
//                this._result.ShouldBeNull();
//            });
//});
//
//
//describe('When_looking_for_duplicated_property extends PropertyPathLookupTestBase {
//            let helper: ValidatorTestHelper = new ValidatorTestHelper();
//before(() => {
//    let metaEdText = MetaEdTextBuilder.buildIt
//
//        .withBeginNamespace("edfi")
//        .withStartDomainEntity("Entity1")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop1", "doc")
//        .withIntegerProperty("Prop2", "doc", true, false)
//        .withEndDomainEntity()
//
//        .withStartDomainEntity("Entity2")
//        .withDocumentation("doc")
//        .withReferenceIdentity("Entity1", "doc", "Test")
//        .withReferenceIdentity("Entity1", "doc", "Win")
//        .withEndDomainEntity()
//        .withEndNamespace().toString();
//    helper.setup(metaEdText, validatorListener);
//});
//            protected getPathToTest(): string[] {
//    return new Array("Entity1");
//});
//            protected getEntityContextToTest(): EntityContext {
//    return _symbolTable.Get(this.symbolTableEntityType.domainEntityEntityType(), "Entity2");
//});
//            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean {
//    return PropertyPathLookup.MatchAllIdentityProperties();
//});
//it('should_return_null(): void {
//                this._result.ShouldBeNull();
//            });
//});
//
//
//describe('When_looking_for_deep_property extends PropertyPathLookupTestBase {
//            let helper: ValidatorTestHelper = new ValidatorTestHelper();
//before(() => {
//    let metaEdText = MetaEdTextBuilder.buildIt
//
//        .withBeginNamespace("edfi")
//        .withStartDomainEntity("Entity1")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop1", "doc")
//        .withIntegerProperty("Prop2", "doc", true, false)
//        .withEndDomainEntity()
//
//        .withStartDomainEntity("Entity2")
//        .withDocumentation("doc")
//        .withReferenceIdentity("Entity1", "doc", "Test")
//        .withEndDomainEntity()
//        .withEndNamespace().toString();
//    helper.setup(metaEdText, validatorListener);
//});
//            protected getPathToTest(): string[] {
//    return new Array("Entity1", "Prop1");
//});
//            protected getEntityContextToTest(): EntityContext {
//    return _symbolTable.Get(this.symbolTableEntityType.domainEntityEntityType(), "Entity2");
//});
//            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean {
//    return PropertyPathLookup.MatchAllIdentityProperties();
//});
//it('should_return_expected_property(): void {
//                this._result.ShouldNotBeNull();
//this._result.IdNode().GetText().should.equal("Prop1");
//            });
//});
//
//
import SymbolTableEntityType from '../SymbolTableEntityType'

//describe('When_looking_for_non_pk_property extends PropertyPathLookupTestBase {
//            let helper: ValidatorTestHelper = new ValidatorTestHelper();
//before(() => {
//    let metaEdText = MetaEdTextBuilder.buildIt
//
//        .withBeginNamespace("edfi")
//        .withStartDomainEntity("Entity1")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop1", "doc")
//        .withIntegerProperty("Prop2", "doc", true, false)
//        .withEndDomainEntity()
//
//        .withStartDomainEntity("Entity2")
//        .withDocumentation("doc")
//        .withIntegerIdentity("Prop3", "doc")
//        .withReferenceProperty("Entity1", "doc", false, false,/*context:*/"Test")
//        .withEndDomainEntity()
//        .withEndNamespace().toString();
//    helper.setup(metaEdText, validatorListener);
//});
//            protected getPathToTest(): string[] {
//    return new Array("Entity1", "Prop1");
//});
//            protected getEntityContextToTest(): EntityContext {
//    return _symbolTable.Get(this.symbolTableEntityType.domainEntityEntityType(), "Entity2");
//});
//            protected getFilterToTest(): (_: IPropertyWithComponents) => boolean {
//    return PropertyPathLookup.MatchAllButFirstAsIdentityProperties();
//});
//it('should_return_expected_property(): void {
//                this._result.ShouldNotBeNull();
//this._result.IdNode().GetText().should.equal("Prop1");
//            });
//});
//});