import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import ValidatorTestHelper from "../ValidatorTestHelper";
import ValidatorListener from "../../../../src/core/validators/ValidatorListener";
import {CommonTypeExtensionMustNotDuplicateCommonTypePropertyName}from "../../../../src/core/validators/CommonTypeExtension/CommonTypeExtensionMustNotDuplicateCommonTypePropertyName"

chai.should();

describe('CommonTypeExtensionMustNotDuplicateCommonTypePropertyNameTests', () => { 
	let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.CommonTypeExtensionContext>(
            new CommonTypeExtensionMustNotDuplicateCommonTypePropertyName(entityType)));
    
        
        describe('When_common_type_extension_has_different_property_name', () => {
            let entityName: string = "MyIdentifier";
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.build()
                
.withBeginNamespace("edfi")
.withStartCommonType(entityName)
.withDocumentation("doc")
.withBooleanProperty("Property1", "doc", true, false)
.withEndAssociation()
                
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
    
        
        describe('When_common_type_extension_has_duplicate_property_name', () => {
            let entityName: string = "MyIdentifier";
            const duplicatePropertyName: string = "Property1";
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.build()
                
.withBeginNamespace("edfi")
.withStartCommonType(entityName)
.withDocumentation("doc")
.withBooleanProperty(duplicatePropertyName, "doc", true, false)
.withEndCommonType()
                
.withStartCommonTypeExtension(entityName)
.withBooleanProperty(duplicatePropertyName, "doc", true, false)
.withEndCommonTypeExtension()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_validation_failure()', () => {
                helper.errorMessageCollection.should.be.empty;
            });
            it('should_have_validation_failure_message()', () => {
                helper.errorMessageCollection[0].message.should.include("Common Type additions");
                helper.errorMessageCollection[0].message.should.include(entityName);
                helper.errorMessageCollection[0].message.should.include(duplicatePropertyName);
                helper.errorMessageCollection[0].message.should.include("already in property list");
            });
});
});