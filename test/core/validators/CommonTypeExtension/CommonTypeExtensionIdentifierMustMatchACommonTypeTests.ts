/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import {ValidationTestHelper} from "../ValidationTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {CommonTypeExtensionIdentifierMustMatchACommonType} from "../../../../src/core/validators/CommonTypeExtension/CommonTypeExtensionIdentifierMustMatchACommonType"

let should = chai.should();

describe('CommonTypeExtensionIdentifierMustMatchACommonTypeTests', () => { 
	let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.CommonTypeExtensionContext>(
            new CommonTypeExtensionIdentifierMustMatchACommonType()));
    
        
        describe('When_common_type_extension_has_valid_extendee', () => {
            let entityName: string = "MyIdentifier";
            const _property_name: string = "Property1";
            let helper: ValidationTestHelper = new ValidationTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.buildIt
                
.withBeginNamespace("edfi")
.withStartCommonType(entityName)
.withDocumentation("doc")
.withBooleanProperty("Property1", "doc", true, false)
.withEndCommonType()
                
.withStartCommonTypeExtension(entityName)
.withBooleanProperty("Property2", "doc", true, false)
.withEndCommonTypeExtension()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_no_validation_failures()', () => {
                helper.errorMessageCollection.length.should.equal(0);
            });
});
    
        
        describe('When_common_type_extension_has_invalid_extendee', () => {
            let entityName: string = "NotACommonTypeIdentifier";
            let helper: ValidationTestHelper = new ValidationTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.buildIt
                
.withBeginNamespace("edfi")
.withStartCommonTypeExtension(entityName)
.withBooleanProperty("Property2", "doc", false, false)
.withEndCommonTypeExtension()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_validation_failure()', () => {
                helper.errorMessageCollection.Any().ShouldBeTrue();
            });
            it('should_have_validation_failure_message()', () => {
                helper.errorMessageCollection[0].Message.ShouldContain("Common Type additions");
                helper.errorMessageCollection[0].Message.ShouldContain(entityName);
                helper.errorMessageCollection[0].Message.ShouldContain("does not match");
            });
});
});