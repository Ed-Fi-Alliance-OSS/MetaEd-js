import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import {ValidatorTestHelper} from "../ValidatorTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass}from "../../../../src/core/validators/AssociationSubclass/AssociationSubclassIdentityRenameMustMatchPrimaryKeyPropertyInBaseClass"

let should = chai.should();

describe('AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClassTests', () => {

    //TODO: one had a different validator listener
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.AssociationSubclassContext>(
            new AssociationSubclassIdentityRenameMustMatchIdentityPropertyInBaseClass(symbolTable)));


    describe('When_association_subclass_renames_base_identity', () => {
        let entityName: string = "SubclassIdentifier";
        const baseName: string = "BaseAssociationIdentifier";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()
                .withBeginNamespace("edfi")
                .withStartAssociation(baseName)
                .withDocumentation("because documentation is required")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withStringIdentity("Property1", "because a property is required", 100)
                .withEndAssociation()
                .withStartAssociationSubclass(entityName, baseName)
                .withDocumentation("because documentation is required")
                .withStringIdentityRename("Property2", "Property1", "because a property is required", 100)
                .withEndAssociationSubclass()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.should.be.empty;
        });
    });


    describe('When_association_subclass_does_not_rename_identity', () => {
        let entityName: string = "SubclassIdentifier";
        const baseName: string = "BaseAssociationIdentifier";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartAssociation(baseName)
                .withDocumentation("because documentation is required")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withStringIdentity("Property1", "because a property is required", 100)
                .withEndAssociation()

                .withStartAssociationSubclass(entityName, baseName)
                .withDocumentation("because documentation is required")
                .withStringProperty("Property2", "because a property is required", true, false, 100)
                .withEndAssociationSubclass()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.should.be.empty;
        });
    });


    describe('When_association_subclass_renames_base_identity_more_than_once', () => {
        let entityName: string = "SubclassIdentifier";
        const baseName: string = "BaseAssociationIdentifier";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartAssociation(baseName)
                .withDocumentation("because documentation is required")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withStringIdentity("Property1", "because a property is required", 100)
                .withStringIdentity("Property2", "because a property is required", 100)
                .withEndAssociation()

                .withStartAssociationSubclass(entityName, baseName)
                .withDocumentation("because documentation is required")
                .withStringIdentityRename("Property3", "Property1", "because a property is required", 100)
                .withStringIdentityRename("Property4", "Property2", "because a property is required", 100)
                .withEndAssociationSubclass()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.should.not.be.empty;
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.should.equal("Association 'SubclassIdentifier' based on 'BaseAssociationIdentifier' tries to rename columns Property1, Property2.  Only one identity rename is allowed for a given Association.");
        });
    });


    describe('When_association_subclass_renames_base_identity_that_does_not_exist', () => {
        let entityName: string = "SubclassIdentifier";
        const baseName: string = "BaseAssociationIdentifier";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartAssociation(baseName)
                .withDocumentation("because documentation is required")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withStringIdentity("Property1", "because a property is required", 100)
                .withEndAssociation()

                .withStartAssociationSubclass(entityName, baseName)
                .withDocumentation("because documentation is required")
                .withStringIdentityRename("Property2", "Property3", "because a property is required", 100)
                .withEndAssociationSubclass()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.should.not.be.empty;
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.should.equal("Association 'SubclassIdentifier' based on 'BaseAssociationIdentifier' tries to rename Property3 which is not part of the identity.");
        });
    });


    describe('When_association_subclass_renames_base_property_that_is_not_identity', () => {
        let entityName: string = "SubclassIdentifier";
        const baseName: string = "BaseAssociationIdentifier";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartAssociation(baseName)
                .withDocumentation("because documentation is required")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withStringProperty("Property1", "because a property is required", true, false, 100)
                .withEndAssociation()

                .withStartAssociationSubclass(entityName, baseName)
                .withDocumentation("because documentation is required")
                .withStringIdentityRename("Property2", "Property1", "because a property is required", 100)
                .withEndAssociationSubclass()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.should.not.be.empty;
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.should.equal("Association 'SubclassIdentifier' based on 'BaseAssociationIdentifier' tries to rename Property1 which is not part of the identity.");
        });
    });


    describe('When_association_subclass_extends_non_existent_entity', () => {
        let entityName: string = "SubclassIdentifier";
        const baseName: string = "BaseAssociationIdentifier";
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartAssociationSubclass(entityName, baseName)
                .withDocumentation("because documentation is required")
                .withStringIdentityRename("Property2", "Property1", "because a property is required", 100)
                .withEndAssociationSubclass()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.should.be.empty;
        });
    });
});