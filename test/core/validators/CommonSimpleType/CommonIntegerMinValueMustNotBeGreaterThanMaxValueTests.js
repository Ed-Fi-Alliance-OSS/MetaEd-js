import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import {ValidatorTestHelper} from "../ValidatorTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {CommonIntegerMinValueMustNotBeGreaterThanMaxValue}from "../../../../src/core/validators/CommonSimpleType/CommonIntegerMinValueMustNotBeGreaterThanMaxValue"

let should = chai.should();

describe('CommonIntegerMinValueMustNotBeGreaterThanMaxValueTests', () => { 
	let validatorListener = new CommonIntegerContext(
        new TestRuleProvider<MetaEdGrammar.CommonIntegerContext>(
            new CommonIntegerMinValueMustNotBeGreaterThanMaxValue()));
    
        
        describe('When_validating_common_integer_with_no_min_or_max_value', () => {
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.build()
                
.withBeginNamespace("edfi")
.withStartCommonInteger("EntityForTest")
.withDocumentation("doc")
.withEndCommonInteger()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_no_validation_failures()', () => {
                helper.errorMessageCollection.length.should.equal(0);
            });
});
    
        
        describe('When_validating_common_integer_with_no_min_value', () => {
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.build()
                
.withBeginNamespace("edfi")
.withStartCommonInteger("EntityForTest")
.withDocumentation("doc")
.withMaxValue(100)
.withEndCommonInteger()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_no_validation_failures()', () => {
                helper.errorMessageCollection.length.should.equal(0);
            });
});
    
        
        describe('When_validating_common_integer_with_no_max_value', () => {
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.build()
                
.withBeginNamespace("edfi")
.withStartCommonInteger("EntityForTest")
.withDocumentation("doc")
.withMinValue(0)
.withEndCommonInteger()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_no_validation_failures()', () => {
                helper.errorMessageCollection.length.should.equal(0);
            });
});
    
        
        describe('When_validating_common_integer_with_correct_min_max_value_order', () => {
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.build()
                
.withBeginNamespace("edfi")
.withStartCommonInteger("EntityForTest")
.withDocumentation("doc")
.withMinValue(0)
.withMaxValue(100)
.withEndCommonInteger()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_no_validation_failures()', () => {
                helper.errorMessageCollection.length.should.equal(0);
            });
});
    
        
        describe('When_validating_common_integer_with_min_max_values_out_of_order', () => {
            const entityName: string = "EntityForTest";
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.build()
                
.withBeginNamespace("edfi")
.withStartCommonInteger(entityName)
.withDocumentation("doc")
.withMinValue(100)
.withMaxValue(0)
.withEndCommonInteger()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_validation_failures()', () => {
                helper.errorMessageCollection.Any().ShouldBeTrue();
            });
            it('should_have_validation_failure_message()', () => {
                helper.errorMessageCollection[0].Message.ShouldContain("Common Integer");
                helper.errorMessageCollection[0].Message.ShouldContain(entityName);
                helper.errorMessageCollection[0].Message.ShouldContain("min value greater than max value");
            });
});
    
        
        describe('When_validating_common_integer_with_same_min_max_values', () => {
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.build()
                
.withBeginNamespace("edfi")
.withStartCommonInteger("EntityForTest")
.withDocumentation("doc")
.withMinValue(100)
.withMaxValue(100)
.withEndCommonInteger()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_no_validation_failures()', () => {
                helper.errorMessageCollection.length.should.equal(0);
            });
});
});