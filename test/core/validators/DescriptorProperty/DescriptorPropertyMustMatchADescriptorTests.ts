import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import {ValidatorTestHelper} from "../ValidatorTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {DescriptorPropertyMustMatchADescriptor}from "../../../../src/core/validators/DescriptorProperty/DescriptorPropertyMustMatchADescriptor"

let should = chai.should();

describe('DescriptorPropertyContext', () => { 
	let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.DescriptorPropertyContext>(
            new DescriptorPropertyMustMatchADescriptor(symboltable)));
    
        
        describe('When_descriptor_property_has_valid_identifier', () => {
            let entityName: string = "MyIdentifier";
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.build()
                
.withBeginNamespace("edfi")
.withStartDescriptor(entityName)
.withDocumentation("doc")
.withEndDescriptor()
                
.withStartDomainEntity("DomainEntity")
.withDocumentation("doc")
.withStringIdentity("RequirePrimaryKey", "doc", 100)
.withDescriptorProperty(entityName, "doc", true, false)
.withEndDomainEntity()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_no_validation_failures()', () => {
                helper.errorMessageCollection.length.should.equal(0);
            });
});
    
        
        describe('When_descriptor_property_has_invalid_identifier', () => {
            let entityName: string = "MyIdentifier";
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.build()
                
.withBeginNamespace("edfi")
.withStartDomainEntity("DomainEntity")
.withDocumentation("doc")
.withStringIdentity("RequirePrimaryKey", "doc", 100)
.withDescriptorProperty(entityName, "doc", true, false)
.withEndDomainEntity()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_validation_failure()', () => {
                helper.errorMessageCollection.length.should.not.equal(0)
            });
            it('should_have_validation_failure_message()', () => {
                helper.errorMessageCollection[0].message.should.include("Descriptor");
                helper.errorMessageCollection[0].message.should.include(entityName);
                helper.errorMessageCollection[0].message.should.include("does not match");
            });
});
});