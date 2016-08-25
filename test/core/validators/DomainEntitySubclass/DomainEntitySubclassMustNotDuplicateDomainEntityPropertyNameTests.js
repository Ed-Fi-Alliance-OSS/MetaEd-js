"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const MetaEdTextBuilder_1 = require("../../../grammar/MetaEdTextBuilder");
const chai = require('chai');
const ValidationTestHelper_1 = require("../ValidationTestHelper");
const ValidatorListener_1 = require("../../../../src/core/validators/ValidatorListener");
const TestRuleProvider_1 = require("../TestRuleProvider");
const DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName_1 = require("../../../../src/core/validators/DomainEntitySubclass/DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName");
let should = chai.should();
describe('DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName', () => {
    let validatorListener = new ValidatorListener_1.ValidatorListener(new TestRuleProvider_1.TestRuleProvider(new DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName_1.DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName(helper.symbolTable)));
    describe('When_domain_entity_subclass_has_different_property_name', () => {
        let entityName = "SubclassIdentifier";
        let baseName = "BaseDomainEntityIdentifier";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(baseName)
                .withDocumentation("because documentation is required")
                .withBooleanProperty("Property1", "because a property is required", true, false)
                .withEndDomainEntity()
                .withStartDomainEntitySubclass(entityName, baseName)
                .withDocumentation("because documentation is required")
                .withBooleanProperty("Property2", "because a property is required", true, false)
                .withEndDomainEntitySubclass()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.Count.ShouldEqual(0);
        });
    });
    describe('When_domain_entity_subclass_has_duplicate_property_name', () => {
        let entityName = "MyIdentifier";
        let baseName = "BaseIdentifier";
        const duplicatePropertyName = "Property1";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(baseName)
                .withDocumentation("because documentation is required")
                .withBooleanProperty(duplicatePropertyName, "because a property is required", true, false)
                .withEndDomainEntity()
                .withStartDomainEntitySubclass(entityName, baseName)
                .withDocumentation("because documentation is required")
                .withBooleanProperty(duplicatePropertyName, "because a property is required", true, false)
                .withEndDomainEntitySubclass()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("DomainEntity");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("based on");
            helper.errorMessageCollection[0].Message.ShouldContain(baseName);
            helper.errorMessageCollection[0].Message.ShouldContain(duplicatePropertyName);
            helper.errorMessageCollection[0].Message.ShouldContain("already in property list");
        });
    });
    describe('When_domain_entity_subclass_has_multiple_duplicate_property_names', () => {
        let entityName = "MyIdentifier";
        let baseName = "BaseIdentifier";
        const notDuplicatePropertyName = "NotADuplicate";
        const duplicatePropertyName1 = "Property1";
        const duplicatePropertyName2 = "Property2";
        let helper = new ValidationTestHelper_1.ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder_1.default.buildIt
                .withBeginNamespace("edfi")
                .withStartDomainEntity(baseName)
                .withDocumentation("because documentation is required")
                .withBooleanProperty(duplicatePropertyName1, "because a property is required", true, false)
                .withBooleanProperty(duplicatePropertyName2, "because a property is required", true, false)
                .withEndDomainEntity()
                .withStartDomainEntitySubclass(entityName, baseName)
                .withDocumentation("because documentation is required")
                .withBooleanProperty(duplicatePropertyName1, "because a property is required", true, false)
                .withBooleanProperty(duplicatePropertyName2, "because a property is required", true, false)
                .withBooleanProperty(notDuplicatePropertyName, "because a property is required", true, false)
                .withEndDomainEntitySubclass()
                .withEndNamespace();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("DomainEntity");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("based on");
            helper.errorMessageCollection[0].Message.ShouldContain(baseName);
            helper.errorMessageCollection[0].Message.ShouldContain(duplicatePropertyName1);
            helper.errorMessageCollection[0].Message.ShouldContain(duplicatePropertyName2);
            helper.errorMessageCollection[0].Message.ShouldContain("already in property list");
            helper.errorMessageCollection[0].Message.ShouldNotContain(notDuplicatePropertyName);
        });
    });
});
//# sourceMappingURL=DomainEntitySubclassMustNotDuplicateDomainEntityPropertyNameTests.js.map