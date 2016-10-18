import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import ValidatorTestHelper from "../ValidatorTestHelper";
import ValidatorListener from "../../../../src/core/validators/ValidatorListener";
import { newRepository } from '../../../../src/core/validators/ValidationRuleRepository';
import { includeRule } from '../../../../src/core/validators/Association/FirstDomainEntityPropertyMustNotCollideWithOtherProperty';
import SymbolTable from "../../../../src/core/validators/SymbolTable";

let should = chai.should();

describe('FirstDomainEntityPropertyMustNotCollideWithOtherProperty', () => {
    const repository = includeRule(newRepository());
    const validatorListener = new ValidatorListener(repository);
    
    describe('When_domain_entity_property_does_not_collide', () => {
        const symbolTable = new SymbolTable();
        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()
                .withBeginNamespace("edfi")
                .withStartDomainEntity("First")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()

                .withStartDomainEntity("Second")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()

                .withStartAssociation("Association1")
                .withDocumentation("doc")
                .withDomainEntityProperty("First", "doc1")
                .withDomainEntityProperty("Second", "doc2")
                .withIntegerProperty("Third", "doc3", false, false)
                .withEndAssociation()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener, symbolTable);
        });
        it('should_have_no_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(0);
        });
    });

    describe('When_domain_entity_property_does_collide', () => {
        const symbolTable = new SymbolTable();
        const associationName = "Association1";
        const firstName = "First";

        let helper: ValidatorTestHelper = new ValidatorTestHelper();
        before(() => {
            let metaEdText = MetaEdTextBuilder.build()
                .withBeginNamespace("edfi")
                .withStartDomainEntity(firstName)
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()

                .withStartDomainEntity("Second")
                .withDocumentation("doc")
                .withStringIdentity("RequirePrimaryKey", "doc", 100)
                .withEndDomainEntity()

                .withStartAssociation(associationName)
                .withDocumentation("doc")
                .withDomainEntityProperty("First", "doc1")
                .withDomainEntityProperty("Second", "doc2")
                .withIntegerProperty("First", "doc3", false, false)
                .withEndAssociation()
                .withEndNamespace().toString();
            helper.setup(metaEdText, validatorListener, symbolTable);
        });
        it('should_have_validation_failures()', () => {
            helper.errorMessageCollection.length.should.equal(1);
        });
        it('should_have_validation_failure_message()', () => {
            helper.errorMessageCollection[0].message.should.include("Entity");
            helper.errorMessageCollection[0].message.should.include(associationName);
            helper.errorMessageCollection[0].message.should.include("has duplicate");
            helper.errorMessageCollection[0].message.should.include(firstName);
        });
    });
});