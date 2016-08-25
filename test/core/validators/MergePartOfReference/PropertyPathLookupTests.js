"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
let should = chai.should();
//TODO: special case?
describe('ReplaceMeWithFileName', () => {
    let validatorListener = new ValidatorListener(new TestRuleProvider(new ReplaceMeWithFileName()));
    describe('PropertyPathLookupTestBase extends BaseValidationTest {, protected, _result, IContextWithIdentifier);
}, protected, getPathToTest(), string[], { throw: new Error('not implemented') });
getEntityContextToTest();
EntityContext;
{
    throw new Error('not implemented');
}
;
getFilterToTest();
((_) => boolean);
{
    throw new Error('not implemented');
}
;
setupPostBuilder();
void {
    let: propertyPathLookup = new PropertyPathLookup(_symbolTable),
    this: ._result = propertyPathLookup.FindReferencedProperty(GetEntityContextToTest(), GetPathToTest(), GetFilterToTest())
};
;
;
describe('When_looking_for_property_on_current_entity extends PropertyPathLookupTestBase {, let, helper, ValidationTestHelper_1.ValidationTestHelper = new ValidationTestHelper_1.ValidationTestHelper());
before(() => {
    let metaEdText = MetaEdTextBuilder.buildIt
        .withBeginNamespace("edfi")
        .withStartDomainEntity("Entity1")
        .withDocumentation("doc")
        .withIntegerIdentity("Prop1", "doc")
        .withEndDomainEntity()
        .withEndNamespace();
    helper.setup(metaEdText, validatorListener);
});
getPathToTest();
string[];
{
    return new Array("Prop1");
}
;
getEntityContextToTest();
EntityContext;
{
    return _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), "Entity1");
}
;
getFilterToTest();
((_) => boolean);
{
    return PropertyPathLookup.MatchAllIdentityProperties();
}
;
it('should_return_expected_property(): void {, this._result.ShouldNotBeNull());
this._result.IdNode().GetText().ShouldEqual("Prop1");
;
;
describe('When_looking_for_first_domain_entity_on_association extends PropertyPathLookupTestBase {, let, helper, ValidationTestHelper_1.ValidationTestHelper = new ValidationTestHelper_1.ValidationTestHelper());
before(() => {
    let metaEdText = MetaEdTextBuilder.buildIt
        .withBeginNamespace("edfi")
        .withStartDomainEntity("Entity1")
        .withDocumentation("doc")
        .withIntegerIdentity("Prop1", "doc")
        .withEndDomainEntity()
        .withStartDomainEntity("Entity2")
        .withDocumentation("doc")
        .withIntegerIdentity("Prop2", "doc")
        .withEndDomainEntity()
        .withStartAssociation("Entity3")
        .withDocumentation("doc")
        .withDomainEntityProperty("Entity1", "doc")
        .withDomainEntityProperty("Entity2", "doc")
        .withEndAssociation()
        .withEndNamespace();
    helper.setup(metaEdText, validatorListener);
});
getPathToTest();
string[];
{
    return new Array("Entity1");
}
;
getEntityContextToTest();
EntityContext;
{
    return _symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), "Entity3");
}
;
getFilterToTest();
((_) => boolean);
{
    return PropertyPathLookup.MatchAllIdentityProperties();
}
;
it('should_return_expected_property(): void {, this._result.ShouldNotBeNull());
this._result.IdNode().GetText().ShouldEqual("Entity1");
;
;
describe('When_looking_for_second_domain_entity_on_association extends PropertyPathLookupTestBase {, let, helper, ValidationTestHelper_1.ValidationTestHelper = new ValidationTestHelper_1.ValidationTestHelper());
before(() => {
    let metaEdText = MetaEdTextBuilder.buildIt
        .withBeginNamespace("edfi")
        .withStartDomainEntity("Entity1")
        .withDocumentation("doc")
        .withIntegerIdentity("Prop1", "doc")
        .withEndDomainEntity()
        .withStartDomainEntity("Entity2")
        .withDocumentation("doc")
        .withIntegerIdentity("Prop2", "doc")
        .withEndDomainEntity()
        .withStartAssociation("Entity3")
        .withDocumentation("doc")
        .withDomainEntityProperty("Entity1", "doc")
        .withDomainEntityProperty("Entity2", "doc")
        .withEndAssociation()
        .withEndNamespace();
    helper.setup(metaEdText, validatorListener);
});
getPathToTest();
string[];
{
    return new Array("Entity2");
}
;
getEntityContextToTest();
EntityContext;
{
    return _symbolTable.Get(SymbolTableEntityType.AssociationEntityType(), "Entity3");
}
;
getFilterToTest();
((_) => boolean);
{
    return PropertyPathLookup.MatchAllIdentityProperties();
}
;
it('should_return_expected_property(): void {, this._result.ShouldNotBeNull());
this._result.IdNode().GetText().ShouldEqual("Entity2");
;
;
describe('When_looking_for_non_identity_property_on_current_entity extends PropertyPathLookupTestBase {, let, helper, ValidationTestHelper_1.ValidationTestHelper = new ValidationTestHelper_1.ValidationTestHelper());
before(() => {
    let metaEdText = MetaEdTextBuilder.buildIt
        .withBeginNamespace("edfi")
        .withStartDomainEntity("Entity1")
        .withDocumentation("doc")
        .withIntegerIdentity("Prop1", "doc")
        .withIntegerProperty("Prop2", "doc", true, false)
        .withEndDomainEntity()
        .withEndNamespace();
    helper.setup(metaEdText, validatorListener);
});
getPathToTest();
string[];
{
    return new Array("Prop2");
}
;
getEntityContextToTest();
EntityContext;
{
    return _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), "Entity1");
}
;
getFilterToTest();
((_) => boolean);
{
    return PropertyPathLookup.MatchAllIdentityProperties();
}
;
it('should_return_null(): void {, this._result.ShouldBeNull());
;
;
describe('When_looking_for_property_that_does_not_exist extends PropertyPathLookupTestBase {, let, helper, ValidationTestHelper_1.ValidationTestHelper = new ValidationTestHelper_1.ValidationTestHelper());
before(() => {
    let metaEdText = MetaEdTextBuilder.buildIt
        .withBeginNamespace("edfi")
        .withStartDomainEntity("Entity1")
        .withDocumentation("doc")
        .withIntegerIdentity("Prop1", "doc")
        .withIntegerProperty("Prop2", "doc", true, false)
        .withEndDomainEntity()
        .withEndNamespace();
    helper.setup(metaEdText, validatorListener);
});
getPathToTest();
string[];
{
    return new Array("Prop3");
}
;
getEntityContextToTest();
EntityContext;
{
    return _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), "Entity1");
}
;
getFilterToTest();
((_) => boolean);
{
    return PropertyPathLookup.MatchAllIdentityProperties();
}
;
it('should_return_null(): void {, this._result.ShouldBeNull());
;
;
describe('When_looking_for_duplicated_property extends PropertyPathLookupTestBase {, let, helper, ValidationTestHelper_1.ValidationTestHelper = new ValidationTestHelper_1.ValidationTestHelper());
before(() => {
    let metaEdText = MetaEdTextBuilder.buildIt
        .withBeginNamespace("edfi")
        .withStartDomainEntity("Entity1")
        .withDocumentation("doc")
        .withIntegerIdentity("Prop1", "doc")
        .withIntegerProperty("Prop2", "doc", true, false)
        .withEndDomainEntity()
        .withStartDomainEntity("Entity2")
        .withDocumentation("doc")
        .withReferenceIdentity("Entity1", "doc", "Test")
        .withReferenceIdentity("Entity1", "doc", "Win")
        .withEndDomainEntity()
        .withEndNamespace();
    helper.setup(metaEdText, validatorListener);
});
getPathToTest();
string[];
{
    return new Array("Entity1");
}
;
getEntityContextToTest();
EntityContext;
{
    return _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), "Entity2");
}
;
getFilterToTest();
((_) => boolean);
{
    return PropertyPathLookup.MatchAllIdentityProperties();
}
;
it('should_return_null(): void {, this._result.ShouldBeNull());
;
;
describe('When_looking_for_deep_property extends PropertyPathLookupTestBase {, let, helper, ValidationTestHelper_1.ValidationTestHelper = new ValidationTestHelper_1.ValidationTestHelper());
before(() => {
    let metaEdText = MetaEdTextBuilder.buildIt
        .withBeginNamespace("edfi")
        .withStartDomainEntity("Entity1")
        .withDocumentation("doc")
        .withIntegerIdentity("Prop1", "doc")
        .withIntegerProperty("Prop2", "doc", true, false)
        .withEndDomainEntity()
        .withStartDomainEntity("Entity2")
        .withDocumentation("doc")
        .withReferenceIdentity("Entity1", "doc", "Test")
        .withEndDomainEntity()
        .withEndNamespace();
    helper.setup(metaEdText, validatorListener);
});
getPathToTest();
string[];
{
    return new Array("Entity1", "Prop1");
}
;
getEntityContextToTest();
EntityContext;
{
    return _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), "Entity2");
}
;
getFilterToTest();
((_) => boolean);
{
    return PropertyPathLookup.MatchAllIdentityProperties();
}
;
it('should_return_expected_property(): void {, this._result.ShouldNotBeNull());
this._result.IdNode().GetText().ShouldEqual("Prop1");
;
;
describe('When_looking_for_non_pk_property extends PropertyPathLookupTestBase {, let, helper, ValidationTestHelper_1.ValidationTestHelper = new ValidationTestHelper_1.ValidationTestHelper());
before(() => {
    let metaEdText = MetaEdTextBuilder.buildIt
        .withBeginNamespace("edfi")
        .withStartDomainEntity("Entity1")
        .withDocumentation("doc")
        .withIntegerIdentity("Prop1", "doc")
        .withIntegerProperty("Prop2", "doc", true, false)
        .withEndDomainEntity()
        .withStartDomainEntity("Entity2")
        .withDocumentation("doc")
        .withIntegerIdentity("Prop3", "doc")
        .withReferenceProperty("Entity1", "doc", false, false, /*context:*/ "Test")
        .withEndDomainEntity()
        .withEndNamespace();
    helper.setup(metaEdText, validatorListener);
});
getPathToTest();
string[];
{
    return new Array("Entity1", "Prop1");
}
;
getEntityContextToTest();
EntityContext;
{
    return _symbolTable.Get(SymbolTableEntityType.DomainEntityEntityType(), "Entity2");
}
;
getFilterToTest();
((_) => boolean);
{
    return PropertyPathLookup.MatchAllButFirstAsIdentityProperties();
}
;
it('should_return_expected_property(): void {, this._result.ShouldNotBeNull());
this._result.IdNode().GetText().ShouldEqual("Prop1");
;
;
;
//# sourceMappingURL=PropertyPathLookupTests.js.map