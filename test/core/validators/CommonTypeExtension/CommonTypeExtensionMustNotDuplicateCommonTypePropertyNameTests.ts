/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import {ValidationTestHelper} from "../ValidationTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {CommonTypeExtensionMustNotDuplicateCommonTypePropertyName}from "../../../../src/core/validators/CommonTypeExtension/CommonTypeExtensionMustNotDuplicateCommonTypePropertyName"

let should = chai.should();

describe('CommonTypeExtensionMustNotDuplicateCommonTypePropertyNameTests', () => { 
	let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.CommonTypeExtensionContext>(
            new CommonTypeExtensionMustNotDuplicateCommonTypePropertyName(entityType)));
    
        
        describe('When_common_type_extension_has_different_property_name', () => {
            let entityName: string = "MyIdentifier";
            let helper: ValidationTestHelper = new ValidationTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.buildIt
                
.withBeginNamespace("edfi")
.withStartCommonType(entityName)
.withDocumentation("doc")
.withBooleanProperty("Property1", "doc", true, false)
.withEndAssociation()
                
.withStartCommonTypeExtension(entityName)
.withBooleanProperty("Property2", "doc", true, false)
.withEndCommonTypeExtension()
.withEndNamespace();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_no_validation_failures()', () => {
                helper.errorMessageCollection.Count.ShouldEqual(0);
            });
});
    
        
        describe('When_common_type_extension_has_duplicate_property_name', () => {
            let entityName: string = "MyIdentifier";
            const duplicatePropertyName: string = "Property1";
            let helper: ValidationTestHelper = new ValidationTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.buildIt
                
.withBeginNamespace("edfi")
.withStartCommonType(entityName)
.withDocumentation("doc")
.withBooleanProperty(duplicatePropertyName, "doc", true, false)
.withEndCommonType()
                
.withStartCommonTypeExtension(entityName)
.withBooleanProperty(duplicatePropertyName, "doc", true, false)
.withEndCommonTypeExtension()
.withEndNamespace();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_validation_failure()', () => {
                helper.errorMessageCollection.Any().ShouldBeTrue();
            });
            it('should_have_validation_failure_message()', () => {
                helper.errorMessageCollection[0].Message.ShouldContain("Common Type additions");
                helper.errorMessageCollection[0].Message.ShouldContain(entityName);
                helper.errorMessageCollection[0].Message.ShouldContain(duplicatePropertyName);
                helper.errorMessageCollection[0].Message.ShouldContain("already in property list");
            });
});
});