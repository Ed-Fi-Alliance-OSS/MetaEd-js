import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import ValidatorTestHelper from "../ValidatorTestHelper";
import ValidatorListener from "../../../../src/core/validators/ValidatorListener";
import {InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass}from "../../../../src/core/validators/Interchange/InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass"

chai.should();

describe('InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass', () => {
    let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.InterchangeIdentityTemplateContext>(
            new InterchangeIdentityTemplateMustMatchADomainEntityOrAssociationOrSubclass(helper.symbolTable)));


    describe('When_identity_template_is_domain_entity', () => {
        let entityName: string = "EntityName";
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()

                .withStartInterchange("InterchangeName")
                .withDocumentation("doc")
                .withIdentityTemplate(entityName)
                .withElement("Required")
                .withEndInterchange()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_identity_template_is_domain_entity_subclass', () => {
        let entityName: string = "EntityName";
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartDomainEntity("DomainEntityBase")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()

                .withStartDomainEntitySubclass(entityName, "DomainEntityBase")
                .withDocumentation("doc")
                .withDateProperty("BeginDate", "doc", true, false)
                .withEndDomainEntitySubclass()
                
.withStartInterchange("InterchangeName")
                .withDocumentation("doc")
                .withIdentityTemplate(entityName)
                .withElement("Required")
                .withEndInterchange()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_identity_template_is_association', () => {
        let entityName: string = "MyIdentifier";
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartAssociation(entityName)
                .withDocumentation("doc")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withBooleanProperty("Property1", "because a property is required", true, false)
                .withEndAssociation()

                .withStartInterchange("InterchangeName")
                .withDocumentation("doc")
                .withIdentityTemplate(entityName)
                .withElement("Required")
                .withEndInterchange()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_identity_template_is_association_subclass', () => {
        let entityName: string = "MyIdentifier";
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartAssociation("BaseName")
                .withDocumentation("doc")
                .withDomainEntityProperty("DomainEntity1", "doc")
                .withDomainEntityProperty("DomainEntity2", "doc")
                .withBooleanProperty("Property1", "doc", true, false)
                .withEndAssociation()

                .withStartAssociationSubclass(entityName, "BaseName")
                .withDocumentation("doc")
                .withBooleanProperty("Property2", "doc", true, false)
                .withEndAssociationSubclass()
                
.withStartInterchange("InterchangeName")
                .withDocumentation("doc")
                .withIdentityTemplate(entityName)
                .withElement("Required")
                .withEndInterchange()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_identity_template_is_abstract_entity', () => {
        let entityName: string = "MyIdentifier";
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartAbstractEntity(entityName)
                .withDocumentation("doc")
                .withStringIdentity("Property1", "doc", 100)
                .withEndAbstractEntity()
                
.withStartInterchange("InterchangeName")
                .withDocumentation("doc")
                .withIdentityTemplate(entityName)
                .withElement("Required")
                .withEndInterchange()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });


    describe('When_identity_template_has_invalid_identifier', () => {
        let entityName: string = "MyIdentifier";
        const helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            const metaEdText = MetaEdTextBuilder.build()

                .withBeginNamespace("edfi")
                .withStartInterchange("InterchangeName")
                .withDocumentation("doc")
                .withIdentityTemplate(entityName)
                .withElement("Required")
                .withEndInterchange()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener);
        });

        it('should_have_validation_failure()', () => {
            helper.errorMessageCollection.should.be.empty;
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].message.should.include("identity template");
            helper.errorMessageCollection[0].message.should.include(entityName);
            helper.errorMessageCollection[0].message.should.include("does not match");
        });
    });
});