/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import {ValidationTestHelper} from "../ValidationTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {AbstractEntityMustContainAPrimaryKey} from "../../../src/core/validators/AbstractEntity/AbstractEntityMustContainAPrimaryKey"

let should = chai.should();

describe('AbstractEntityMustContainAPrimaryKeyTests', () => { 
	let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.AbstractEntityContext>(
            new AbstractEntityMustContainAPrimaryKey()));
    
        
        describe('When_validating_domain_entity_with_identity_fields', () => {
            let helper: ValidationTestHelper = new ValidationTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.buildIt
                
.withBeginNamespace("edfi")
.withStartAbstractEntity("AbstractEntity1")
.withDocumentation("doc1")
.withStringIdentity("Property1", "doc2", 100)
.withEndAbstractEntity()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
                });

            it('should_have_no_validation_failures()', () => {
                helper.errorMessageCollection.count.should.equal(0);
            });
});
    
        
        describe('When_validating_domain_entity_with_no_identity_fields', () => {
            let entityName: string = "MyIdentifier";
            let helper: ValidationTestHelper = new ValidationTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.buildIt
                
.withBeginNamespace("edfi")
.withStartAbstractEntity(entityName)
.withDocumentation("doc1")
.withDateProperty("Property1", "doc2", true, false)
.withEndAbstractEntity()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            it('should_have_validation_failure()', () => {
                helper.errorMessageCollection.Any().ShouldBeTrue();
            });
            it('should_have_validation_failure_message()', () => {
                helper.errorMessageCollection[0].Message.ShouldContain("Abstract Entity");
                helper.errorMessageCollection[0].Message.ShouldContain(entityName);
                helper.errorMessageCollection[0].Message.ShouldContain("does not have an identity");
            });
});
});