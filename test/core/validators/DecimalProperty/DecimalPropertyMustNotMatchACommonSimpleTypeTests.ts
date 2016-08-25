/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import {ValidationTestHelper} from "../ValidationTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {DecimalPropertyMustNotMatchACommonSimpleType}from "../../../../src/core/validators/DecimalProperty/DecimalPropertyMustNotMatchACommonSimpleType"

let should = chai.should();

describe('DecimalPropertyMustNotMatchACommonSimpleTypeTests', () => { 
	let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.DecimalPropertyContext>(
            new DecimalPropertyMustNotMatchACommonSimpleType(symbolTable)));
    
        
        describe('When_decimal_property_has_identifier_matching_no_common_simple_types', () => {
            let entityName: string = "EntityName";
            let propertyName: string = "PropertyName";
            let helper: ValidationTestHelper = new ValidationTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.buildIt
                
.withBeginNamespace("edfi")
.withStartDomainEntity(entityName)
.withDocumentation("doc")
.withStringIdentity("RequirePrimaryKey", "doc", 100)
.withDecimalProperty(propertyName, "doc", false, false, "10", "2")
.withEndDomainEntity()
.withEndNamespace();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_no_validation_failures()', () => {
                helper.errorMessageCollection.Count.ShouldEqual(0);
            });
});
    
        
        describe('When_decimal_property_has_identifier_matching_common_decimal', () => {
            const entityName: string = "CommonEntityName";
            let helper: ValidationTestHelper = new ValidationTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.buildIt
                
.withBeginNamespace("edfi")
.withStartCommonDecimal(entityName)
.withDocumentation("doc")
.withTotalDigits("10")
.withDecimalPlaces("2")
.withEndCommonDecimal()
                
.withStartDomainEntity("EntityName")
.withDocumentation("doc")
.withStringIdentity("RequirePrimaryKey", "doc", 100)
.withDecimalProperty(entityName, "doc", false, false, "10", "2")
.withEndDomainEntity()
.withEndNamespace();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_validation_failures()', () => {
                helper.errorMessageCollection.Any().ShouldBeTrue();
            });
            it('should_have_validation_failure_message()', () => {
                helper.errorMessageCollection[0].Message.ShouldContain("Decimal property");
                helper.errorMessageCollection[0].Message.ShouldContain(entityName);
                helper.errorMessageCollection[0].Message.ShouldContain("has the same name");
            });
});
    
        describe('When_decimal_property_has_identifier_matching_common_integer', () => {
            const entityName: string = "CommonEntityName";
            let helper: ValidationTestHelper = new ValidationTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.buildIt
                
.withBeginNamespace("edfi")
.withStartCommonInteger(entityName)
.withDocumentation("doc")
.withMaxValue(100)
.withEndCommonInteger()
                
.withStartDomainEntity("EntityName")
.withDocumentation("doc")
.withStringIdentity("RequirePrimaryKey", "doc", 100)
.withDecimalProperty(entityName, "doc", false, false, "10", "2")
.withEndDomainEntity()
.withEndNamespace();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_validation_failures()', () => {
                helper.errorMessageCollection.Any().ShouldBeTrue();
            });
            it('should_have_validation_failure_message()', () => {
                helper.errorMessageCollection[0].Message.ShouldContain("Decimal property");
                helper.errorMessageCollection[0].Message.ShouldContain(entityName);
                helper.errorMessageCollection[0].Message.ShouldContain("has the same name");
            });
});
    
        describe('When_decimal_property_has_identifier_matching_common_short', () => {
            const entityName: string = "CommonEntityName";
            let helper: ValidationTestHelper = new ValidationTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.buildIt
                
.withBeginNamespace("edfi")
.withStartCommonShort(entityName)
.withDocumentation("doc")
.withMaxValue(100)
.withEndCommonShort()
                
.withStartDomainEntity("EntityName")
.withDocumentation("doc")
.withStringIdentity("RequirePrimaryKey", "doc", 100)
.withDecimalProperty(entityName, "doc", false, false, "10", "2")
.withEndDomainEntity()
.withEndNamespace();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_validation_failures()', () => {
                helper.errorMessageCollection.Any().ShouldBeTrue();
            });
            it('should_have_validation_failure_message()', () => {
                helper.errorMessageCollection[0].Message.ShouldContain("Decimal property");
                helper.errorMessageCollection[0].Message.ShouldContain(entityName);
                helper.errorMessageCollection[0].Message.ShouldContain("has the same name");
            });
});
    
        describe('When_decimal_property_has_identifier_matching_common_string', () => {
            const entityName: string = "CommonEntityName";
            let helper: ValidationTestHelper = new ValidationTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.buildIt
                
.withBeginNamespace("edfi")
.withStartCommonString(entityName)
.withDocumentation("doc")
.withMaxLength(100)
.withEndCommonString()
                
.withStartDomainEntity("EntityName")
.withDocumentation("doc")
.withStringIdentity("RequirePrimaryKey", "doc", 100)
.withDecimalProperty(entityName, "doc", false, false, "10", "2")
.withEndDomainEntity()
.withEndNamespace();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_validation_failures()', () => {
                helper.errorMessageCollection.Any().ShouldBeTrue();
            });
            it('should_have_validation_failure_message()', () => {
                helper.errorMessageCollection[0].Message.ShouldContain("Decimal property");
                helper.errorMessageCollection[0].Message.ShouldContain(entityName);
                helper.errorMessageCollection[0].Message.ShouldContain("has the same name");
            });
});
});