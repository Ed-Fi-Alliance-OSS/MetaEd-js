/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import {ValidationTestHelper} from "../ValidationTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {AssociationSubclassIdentifierMustMatchAnAssociation}from "../../../../src/core/validators/AssociationSubclass/AssociationSubclassIdentifierMustMatchAnAssociation"

let should = chai.should();

describe('AssociationSubclassIdentifierMustMatchAnAssociationTests', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.AssociationSubclassContext>(
            new AssociationSubclassIdentifierMustMatchAnAssociation(symbolTable)));


    describe('When_association_subclass_has_valid_extendee', () => {
        let entityName: string = "MyIdentifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartAssociation(entityName)
                .withDocumentation("doc")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withBooleanProperty("Property1", "doc", true, false)
                .withEndAssociation()

                .withStartAssociationSubclass("NewSubclass", entityName)
                .withDocumentation("doc")
                .withBooleanProperty("Property2", "doc", true, false)
                .withEndAssociationSubclass()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_association_subclass_has_invalid_extendee', () => {
        let entityName: string = "MyIdentifier";
        const baseName: string = "NotAnAssociationIdentifier";
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.buildIt

                .withBeginNamespace("edfi")
                .withStartAssociationSubclass(entityName, baseName)
                .withDocumentation("doc")
                .withBooleanProperty("Property1", "doc", true, false)
                .withEndAssociationSubclass()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });
        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.Any().ShouldBeTrue();
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].Message.ShouldContain("Association");
            helper.errorMessageCollection[0].Message.ShouldContain(entityName);
            helper.errorMessageCollection[0].Message.ShouldContain("based on");
            helper.errorMessageCollection[0].Message.ShouldContain(baseName);
            helper.errorMessageCollection[0].Message.ShouldContain("does not match");
        });
    });
});