import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import ValidatorTestHelper from "../ValidatorTestHelper";
import ValidatorListener from "../../../../src/core/validators/ValidatorListener";
import {DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity}from "../../../../src/core/validators/DomainEntitySubclass/DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity"

chai.should();

describe('DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.DomainEntitySubclassContext>(
            new DomainEntitySubclassIdentifierMustMatchADomainOrAbstractEntity(helper.symbolTable)));


    describe('When_domain_entity_subclass_extends_domain_entity', () => {
        let entityName: string = "MyIdentifier";
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withBooleanProperty("Property1", "doc", true, false)
                .withEndDomainEntity()

                .withStartDomainEntitySubclass("NewSubclassName", entityName)
                .withDocumentation("doc")
                .withBooleanProperty("Property2", "doc", true, false)
                .withEndDomainEntitySubclass()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_domain_entity_subclass_extends_abstract_entity', () => {
        let entityName: string = "MyIdentifier";
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartAbstractEntity(entityName)
                .withDocumentation("doc")
                .withStringIdentity("Property1", "doc", 100)
                .withEndAbstractEntity()

                .withStartDomainEntitySubclass("NewSubclassName", entityName)
                .withDocumentation("doc")
                .withBooleanProperty("Property2", "doc", true, false)
                .withEndDomainEntitySubclass()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_domain_entity_subclass_has_invalid_extendee', () => {
        let entityName: string = "MyIdentifier";
        const baseName: string = "NotAnDomainEntityIdentifier";
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartDomainEntitySubclass(entityName, baseName)
                .withDocumentation("doc")
                .withBooleanProperty("Property1", "doc", true, false)
                .withEndDomainEntitySubclass()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.length.should.not.equal(0)
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].message.should.include("DomainEntity");
            helper.errorMessageCollection[0].message.should.include(entityName);
            helper.errorMessageCollection[0].message.should.include("based on");
            helper.errorMessageCollection[0].message.should.include(baseName);
            helper.errorMessageCollection[0].message.should.include("does not match");
        });
    });
});