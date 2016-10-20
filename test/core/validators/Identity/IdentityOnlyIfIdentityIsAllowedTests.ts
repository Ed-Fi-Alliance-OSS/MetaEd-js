import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import ValidatorTestHelper from "../ValidatorTestHelper";
import ValidatorListener from "../../../../src/core/validators/ValidatorListener";
import {IdentityExistsOnlyIfIdentityIsAllowed}from "../../../../src/core/validators/Identity/IdentityExistsOnlyIfIdentityIsAllowed"

let should = chai.should();

describe('IdentityExistsOnlyIfIdentityIsAllowed', () => { 
	let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.IdentityContext>(
            new IdentityExistsOnlyIfIdentityIsAllowed()));
    
        
        describe('When_domain_entity_has_valid_identity_property', () => {
            let entityName: string = "MyIdentifier";
            let propertyName: string = "Identifier";
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.build()
                
.withBeginNamespace("edfi")
.withStartDomainEntity(entityName)
.withDocumentation("doc")
.withStringIdentity(propertyName, "doc", 100)
.withEndDomainEntity()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_not_have_validation_failure()', () => {
                helper.errorMessageCollection.should.be.empty;
            });
});
    
        
        describe('When_abstract_entity_has_valid_identity_property', () => {
            let entityName: string = "MyIdentifier";
            let propertyName: string = "Identifier";
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.build()
                
.withBeginNamespace("edfi")
.withStartAbstractEntity(entityName)
.withDocumentation("doc")
.withStringIdentity(propertyName, "doc", 100)
.withEndAbstractEntity()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_not_have_validation_failure()', () => {
                helper.errorMessageCollection.should.be.empty;
            });
});
    
        
        describe('When_association_has_valid_identity_property', () => {
            let entityName: string = "MyIdentifier";
            let propertyName: string = "Identifier";
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.build()
                
.withBeginNamespace("edfi")
.withStartAssociation(entityName)
.withDocumentation("doc")
.withDomainEntityProperty("DomainEntity1", "doc")
.withDomainEntityProperty("DomainEntity2", "doc")
.withStringIdentity(propertyName, "doc", 100)
.withEndAssociation()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_not_have_validation_failure()', () => {
                helper.errorMessageCollection.should.be.empty;
            });
});
    
        
        describe('When_common_type_has_valid_identity_property', () => {
            let entityName: string = "MyIdentifier";
            let propertyName: string = "Identifier";
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.build()
                
.withBeginNamespace("edfi")
.withStartCommonType(entityName)
.withDocumentation("doc")
.withStringIdentity(propertyName, "doc", 100)
.withEndCommonType()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_not_have_validation_failure()', () => {
                helper.errorMessageCollection.should.be.empty;
            });
});
    
        
        describe('When_inline_common_type_has_valid_identity_property', () => {
            let entityName: string = "MyIdentifier";
            let propertyName: string = "Identifier";
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.build()
                
.withBeginNamespace("edfi")
.withStartInlineCommonType(entityName)
.withDocumentation("doc")
.withStringIdentity(propertyName, "doc", 100)
.withEndInlineCommonType()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_not_have_validation_failure()', () => {
                helper.errorMessageCollection.should.be.empty;
            });
});
    
        
        describe('When_association_extension_has_invalid_identity_property', () => {
            let entityName: string = "MyIdentifier";
            let propertyName: string = "Identifier";
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.build()
                
.withBeginNamespace("edfi")
.withStartAssociation(entityName)
.withDocumentation("because documentation is required")
.withDomainEntityProperty("DomainEntity1", "doc")
.withDomainEntityProperty("DomainEntity2", "doc")
.withBooleanProperty("Property1", "because a property is required", true, false)
.withEndAssociation()
                
.withStartAssociationExtension(entityName)
.withStringIdentity(propertyName, "doc", 100)
.withEndAssociationExtension()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_validation_failure()', () => {
                helper.errorMessageCollection.should.not.be.empty;
            });
            it('should_have_validation_failure_message()', () => {
                helper.errorMessageCollection[0].message.should.include("Association");
                helper.errorMessageCollection[0].message.should.include("additions");
                helper.errorMessageCollection[0].message.should.include(entityName);
                helper.errorMessageCollection[0].message.should.include(propertyName);
                helper.errorMessageCollection[0].message.should.include("invalid");
            });
});
    
        
        describe('When_association_subclass_has_invalid_identity_property', () => {
            let entityName: string = "MyIdentifier";
            const subClassName: string = "NewSubclass";
            let propertyName: string = "Identifier";
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.build()
                
.withBeginNamespace("edfi")
.withStartAssociation(entityName)
.withDocumentation("doc")
.withDomainEntityProperty("DomainEntity1", "doc")
.withDomainEntityProperty("DomainEntity2", "doc")
.withEndAssociation()
                
.withStartAssociationSubclass(subClassName, entityName)
.withDocumentation("doc")
.withStringIdentity(propertyName, "doc", 100)
.withEndAssociationSubclass()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_validation_failure()', () => {
                helper.errorMessageCollection.should.not.be.empty;
            });
            it('should_have_validation_failure_message()', () => {
                helper.errorMessageCollection[0].message.should.include("Association");
                helper.errorMessageCollection[0].message.should.include(entityName);
                helper.errorMessageCollection[0].message.should.include(subClassName);
                helper.errorMessageCollection[0].message.should.include(propertyName);
                helper.errorMessageCollection[0].message.should.include("invalid");
            });
});
    
        
        describe('When_descriptor_has_invalid_identity_property', () => {
            let entityName: string = "MyIdentifier";
            let propertyName: string = "Identifier";
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.build()
                
.withBeginNamespace("edfi")
.withStartDescriptor(entityName)
.withDocumentation("doc")
.withStringIdentity(propertyName, "doc", 100)
.withStartMapType()
.withDocumentation("map type doc")
.withEnumerationItem("this is short description 1", "doc1")
.withEnumerationItem("this is short description 2", "doc2")
.withEndMapType()
.withEndDescriptor()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_validation_failure()', () => {
                helper.errorMessageCollection.should.not.be.empty;
            });
            it('should_have_validation_failure_message()', () => {
                helper.errorMessageCollection[0].message.should.include("Descriptor");
                helper.errorMessageCollection[0].message.should.include(entityName);
                helper.errorMessageCollection[0].message.should.include(propertyName);
                helper.errorMessageCollection[0].message.should.include("invalid");
            });
});
    
        
        describe('When_domain_entity_extension_has_invalid_identity_property', () => {
            let entityName: string = "MyIdentifier";
            let propertyName: string = "Identifier";
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.build()
                
.withBeginNamespace("edfi")
.withStartDomainEntity(entityName)
.withDocumentation("because documentation is required")
.withBooleanProperty("Property1", "because a property is required", true, false)
.withEndDomainEntity()
                
.withStartDomainEntityExtension(entityName)
.withStringIdentity(propertyName, "doc", 100)
.withEndDomainEntityExtension()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_validation_failure()', () => {
                helper.errorMessageCollection.should.not.be.empty;
            });
            it('should_have_validation_failure_message()', () => {
                helper.errorMessageCollection[0].message.should.include("Domain Entity");
                helper.errorMessageCollection[0].message.should.include("additions");
                helper.errorMessageCollection[0].message.should.include(entityName);
                helper.errorMessageCollection[0].message.should.include(propertyName);
                helper.errorMessageCollection[0].message.should.include("invalid");
            });
});
    
        
        describe('When_domain_entity_subclass_has_invalid_identity_property', () => {
            let entityName: string = "MyIdentifier";
            const subClassName: string = "NewSubclass";
            let propertyName: string = "Identifier";
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.build()
                
.withBeginNamespace("edfi")
.withStartDomainEntity(entityName)
.withDocumentation("doc")
.withStringIdentity("BaseIdentifier", "doc", 100)
.withEndDomainEntity()
                
.withStartDomainEntitySubclass(subClassName, entityName)
.withDocumentation("doc")
.withStringIdentity(propertyName, "doc", 100)
.withEndDomainEntitySubclass()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_validation_failure()', () => {
                helper.errorMessageCollection.should.not.be.empty;
            });
            it('should_have_validation_failure_message()', () => {
                helper.errorMessageCollection[0].message.should.include("Domain Entity");
                helper.errorMessageCollection[0].message.should.include(entityName);
                helper.errorMessageCollection[0].message.should.include(subClassName);
                helper.errorMessageCollection[0].message.should.include(propertyName);
                helper.errorMessageCollection[0].message.should.include("invalid");
            });
});
});