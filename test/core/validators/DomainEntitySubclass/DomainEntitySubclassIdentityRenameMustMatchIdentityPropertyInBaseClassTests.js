////TODO: Different TestRuleProvider parameters!
///// <reference path="../../../../typings/index.d.ts" />
//import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
//import chai = require('chai');
//import {ValidatorTestHelper} from "../ValidatorTestHelper";
//import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
//import {TestRuleProvider} from "../TestRuleProvider";
//import {DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass}from "../../../../src/core/validators/DomainEntitySubclass/DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass"
//
//let should = chai.should();
//
//describe('DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass', () => {
//    let validatorListener = new ValidatorListener(
//        new TestRuleProvider<MetaEdGrammar.DomainEntitySubclassContext>(
//            new DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(helper.symbolTable)));
//
//
//    describe('When_domain_entity_subclass_renames_base_identity', () => {
//        let entityName: string = "SubclassIdentifier";
//        const baseName: string = "BaseDomainEntityIdentifier";
//        let helper: ValidatorTestHelper = new ValidatorTestHelper();
//        before(() => {
//            let metaEdText = MetaEdTextBuilder.buildIt
//
//                .withBeginNamespace("edfi")
//                .withStartDomainEntity(baseName)
//                .withDocumentation("because documentation is required")
//                .withStringIdentity("Property1", "because a property is required", 100)
//                .withEndDomainEntity()
//
//                .withStartDomainEntitySubclass(entityName, baseName)
//                .withDocumentation("because documentation is required")
//                .withStringIdentityRename("Property2", "Property1", "because a property is required", 100)
//                .withEndDomainEntitySubclass()
//                .withEndNamespace().toString();
//            helper.setup(metaEdText, validatorListener);
//        });
//            protected getRuleProvider(): IRuleProvider {
//            return __init(new TestRuleProvider<MetaEdGrammar.DomainEntitySubclassContext>(), { SuppliedRule: new DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(helper.symbolTable) }););
//});
//it('should_have_no_validation_failures()', () => {
//    helper.errorMessageCollection.should.be.empty;
//});
//});
//
//
//describe('When_domain_entity_subclass_does_not_rename_identity', () => {
//    let entityName: string = "SubclassIdentifier";
//    const baseName: string = "BaseDomainEntityIdentifier";
//    let helper: ValidatorTestHelper = new ValidatorTestHelper();
//    before(() => {
//        let metaEdText = MetaEdTextBuilder.buildIt
//
//            .withBeginNamespace("edfi")
//            .withStartDomainEntity(baseName)
//            .withDocumentation("because documentation is required")
//            .withStringIdentity("Property1", "because a property is required", 100)
//            .withEndDomainEntity()
//
//            .withStartDomainEntitySubclass(entityName, baseName)
//            .withDocumentation("because documentation is required")
//            .withStringProperty("Property2", "because a property is required", true, false, 100)
//            .withEndDomainEntitySubclass()
//            .withEndNamespace().toString();
//        helper.setup(metaEdText, validatorListener);
//    });
//            protected getRuleProvider(): IRuleProvider {
//        return __init(new TestRuleProvider<MetaEdGrammar.DomainEntitySubclassContext>(), { SuppliedRule: new DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(helper.symbolTable) }););
//            });
//it('should_have_no_validation_failures()', () => {
//    helper.errorMessageCollection.should.be.empty;
//});
//});
//
//
//describe('When_domain_entity_subclass_renames_base_identity_more_than_once', () => {
//    let entityName: string = "SubclassIdentifier";
//    const baseName: string = "BaseDomainEntityIdentifier";
//    let helper: ValidatorTestHelper = new ValidatorTestHelper();
//    before(() => {
//        let metaEdText = MetaEdTextBuilder.buildIt
//
//            .withBeginNamespace("edfi")
//            .withStartDomainEntity(baseName)
//            .withDocumentation("because documentation is required")
//            .withStringIdentity("Property1", "because a property is required", 100)
//            .withStringIdentity("Property2", "because a property is required", 100)
//            .withEndDomainEntity()
//
//            .withStartDomainEntitySubclass(entityName, baseName)
//            .withDocumentation("because documentation is required")
//            .withStringIdentityRename("Property3", "Property1", "because a property is required", 100)
//            .withStringIdentityRename("Property4", "Property2", "because a property is required", 100)
//            .withEndDomainEntitySubclass()
//            .withEndNamespace().toString();
//        helper.setup(metaEdText, validatorListener);
//    });
//            protected getRuleProvider(): IRuleProvider {
//        return __init(new TestRuleProvider<MetaEdGrammar.DomainEntitySubclassContext>(), { SuppliedRule: new DomainEntitySubclassIdentityRenameMustExistNoMoreThanOnce() }););
//            });
//it('should_have_validation_failures()', () => {
//    helper.errorMessageCollection.should.not.be.empty;
//});
//it('should_have_validation_failure_message()', () => {
//    helper.errorMessageCollection[0].Message.should.equal("Domain Entity 'SubclassIdentifier' based on 'BaseDomainEntityIdentifier' tries to rename columns Property1, Property2.  Only one identity rename is allowed for a given Domain Entity.");
//});
//});
//
//
//describe('When_domain_entity_subclass_renames_base_identity_that_does_not_exist', () => {
//    let entityName: string = "SubclassIdentifier";
//    const baseName: string = "BaseDomainEntityIdentifier";
//    let helper: ValidatorTestHelper = new ValidatorTestHelper();
//    before(() => {
//        let metaEdText = MetaEdTextBuilder.buildIt
//
//            .withBeginNamespace("edfi")
//            .withStartDomainEntity(baseName)
//            .withDocumentation("because documentation is required")
//            .withStringIdentity("Property1", "because a property is required", 100)
//            .withEndDomainEntity()
//
//            .withStartDomainEntitySubclass(entityName, baseName)
//            .withDocumentation("because documentation is required")
//            .withStringIdentityRename("Property2", "Property3", "because a property is required", 100)
//            .withEndDomainEntitySubclass()
//            .withEndNamespace().toString();
//        helper.setup(metaEdText, validatorListener);
//    });
//            protected getRuleProvider(): IRuleProvider {
//        return __init(new TestRuleProvider<MetaEdGrammar.DomainEntitySubclassContext>(), { SuppliedRule: new DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(helper.symbolTable) }););
//            });
//it('should_have_validation_failures()', () => {
//    helper.errorMessageCollection.should.not.be.empty;
//});
//it('should_have_validation_failure_message()', () => {
//    helper.errorMessageCollection[0].Message.should.equal("DomainEntity 'SubclassIdentifier' based on 'BaseDomainEntityIdentifier' tries to rename Property3 which is not part of the identity.");
//});
//});
//
//
//describe('When_domain_entity_subclass_renames_base_property_that_is_not_identity', () => {
//    let entityName: string = "SubclassIdentifier";
//    const baseName: string = "BaseDomainEntityIdentifier";
//    let helper: ValidatorTestHelper = new ValidatorTestHelper();
//    before(() => {
//        let metaEdText = MetaEdTextBuilder.buildIt
//
//            .withBeginNamespace("edfi")
//            .withStartDomainEntity(baseName)
//            .withDocumentation("because documentation is required")
//            .withStringIdentity("Property1", "because a property is required", 100)
//            .withStringProperty("Property3", "foo", true, false, 100)
//            .withEndDomainEntity()
//
//            .withStartDomainEntitySubclass(entityName, baseName)
//            .withDocumentation("because documentation is required")
//            .withStringIdentityRename("Property2", "Property3", "because a property is required", 100)
//            .withEndDomainEntitySubclass()
//            .withEndNamespace().toString();
//        helper.setup(metaEdText, validatorListener);
//    });
//            protected getRuleProvider(): IRuleProvider {
//        return __init(new TestRuleProvider<MetaEdGrammar.DomainEntitySubclassContext>(), { SuppliedRule: new DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(helper.symbolTable) }););
//            });
//it('should_have_validation_failures()', () => {
//    helper.errorMessageCollection.should.not.be.empty;
//});
//it('should_have_validation_failure_message()', () => {
//    helper.errorMessageCollection[0].Message.should.equal("DomainEntity 'SubclassIdentifier' based on 'BaseDomainEntityIdentifier' tries to rename Property3 which is not part of the identity.");
//});
//});
//
//
//describe('When_domain_entity_subclass_extends_non_existant_entity', () => {
//    let entityName: string = "SubclassIdentifier";
//    const baseName: string = "BaseDomainEntityIdentifier";
//    let helper: ValidatorTestHelper = new ValidatorTestHelper();
//    before(() => {
//        let metaEdText = MetaEdTextBuilder.buildIt
//
//            .withBeginNamespace("edfi")
//            .withStartDomainEntitySubclass(entityName, baseName)
//            .withDocumentation("because documentation is required")
//            .withStringIdentityRename("Property2", "Property3", "because a property is required", 100)
//            .withEndDomainEntitySubclass()
//            .withEndNamespace().toString();
//        helper.setup(metaEdText, validatorListener);
//    });
//            protected getRuleProvider(): IRuleProvider {
//        return __init(new TestRuleProvider<MetaEdGrammar.DomainEntitySubclassContext>(), { SuppliedRule: new DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(helper.symbolTable) }););
//            });
//it('should_have_no_validation_failures()', () => {
//    helper.errorMessageCollection.should.be.empty;
//});
//});
//}); 
//# sourceMappingURL=DomainEntitySubclassIdentityRenameMustMatchIdentityPropertyInBaseClassTests.js.map