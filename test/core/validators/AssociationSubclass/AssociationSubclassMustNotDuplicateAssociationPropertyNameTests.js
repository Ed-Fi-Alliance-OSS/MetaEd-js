/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai from 'chai'
import {ValidatorTestHelper} from "../ValidatorTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {AssociationSubclassMustNotDuplicateAssociationPropertyName}from "../../../../src/core/validators/AssociationSubclass/AssociationSubclassMustNotDuplicateAssociationPropertyName"

let should = chai.should();

describe('AssociationSubclassMustNotDuplicateAssociationPropertyName', () => { 
	let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.AssociationSubclassContext>(
            new AssociationSubclassMustNotDuplicateAssociationPropertyName(symbolTable)));
    
        
        describe('When_association_subclass_has_different_property_name', () => {
            let entityName: string = "SubclassIdentifier";
            baseName: string = "BaseAssociationIdentifier";
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.build()
                
.withBeginNamespace("edfi")
.withStartAssociation(baseName)
.withDocumentation("because documentation is required")
.withDomainEntityProperty("DomainEntity1", "doc")
.withDomainEntityProperty("DomainEntity2", "doc")
.withBooleanProperty("Property1", "because a property is required", true, false)
.withEndAssociation()
                
.withStartAssociationSubclass(entityName, baseName)
.withDocumentation("because documentation is required")
.withBooleanProperty("Property2", "because a property is required", true, false)
.withEndAssociationSubclass()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_no_validation_failures()', () => {
                helper.errorMessageCollection.length.should.equal(0);
            });
});
    
        
        describe('When_association_subclass_has_duplicate_property_name', () => {
            let entityName: string = "MyIdentifier";
            baseName: string = "BaseIdentifier";
            const duplicatePropertyName: string = "Property1";
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.build()
                
.withBeginNamespace("edfi")
.withStartAssociation(baseName)
.withDocumentation("because documentation is required")
.withDomainEntityProperty("DomainEntity1", "doc")
.withDomainEntityProperty("DomainEntity2", "doc")
.withBooleanProperty(duplicatePropertyName, "because a property is required", true, false)
.withEndAssociation()
                
.withStartAssociationSubclass(entityName, baseName)
.withDocumentation("because documentation is required")
.withBooleanProperty(duplicatePropertyName, "because a property is required", true, false)
.withEndAssociationSubclass()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_validation_failure()', () => {
                helper.errorMessageCollection.Any().ShouldBeTrue();
            });
            it('should_have_validation_failure_message()', () => {
                helper.errorMessageCollection[0].Message.ShouldContain("Association");
                helper.errorMessageCollection[0].Message.ShouldContain(entityName);
                helper.errorMessageCollection[0].Message.ShouldContain("based on");
                helper.errorMessageCollection[0].Message.ShouldContain(baseName);
                helper.errorMessageCollection[0].Message.ShouldContain(duplicatePropertyName);
                helper.errorMessageCollection[0].Message.ShouldContain("already in property list");
            });
});
    
        
        describe('When_association_subclass_has_multiple_duplicate_property_names', () => {
            let entityName: string = "MyIdentifier";
            baseName: string = "BaseIdentifier";
            const _not_duplicate_property_name: string = "NotADuplicate";
            const duplicatePropertyName1: string = "Property1";
            const duplicatePropertyName2: string = "Property2";
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.build()
                
.withBeginNamespace("edfi")
.withStartAssociation(baseName)
.withDocumentation("because documentation is required")
.withDomainEntityProperty("DomainEntity1", "doc")
.withDomainEntityProperty("DomainEntity2", "doc")
.withBooleanProperty(duplicatePropertyName1, "because a property is required", true, false)
.withBooleanProperty(duplicatePropertyName2, "because a property is required", true, false)
.withEndAssociation()
                
.withStartAssociationSubclass(entityName, baseName)
.withDocumentation("because documentation is required")
.withBooleanProperty(duplicatePropertyName1, "because a property is required", true, false)
.withBooleanProperty(duplicatePropertyName2, "because a property is required", true, false)
.withBooleanProperty(When_association_subclass_has_multiple_duplicate_property_names._not_duplicate_property_name, "because a property is required", true, false)
.withEndAssociationSubclass()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_validation_failure()', () => {
                helper.errorMessageCollection.Any().ShouldBeTrue();
            });
            it('should_have_validation_failure_message()', () => {
                helper.errorMessageCollection[0].Message.ShouldContain("Association");
                helper.errorMessageCollection[0].Message.ShouldContain(entityName);
                helper.errorMessageCollection[0].Message.ShouldContain("based on");
                helper.errorMessageCollection[0].Message.ShouldContain(baseName);
                helper.errorMessageCollection[0].Message.ShouldContain(duplicatePropertyName1);
                helper.errorMessageCollection[0].Message.ShouldContain(duplicatePropertyName2);
                helper.errorMessageCollection[0].Message.ShouldContain("already in property list");
                helper.errorMessageCollection[0].Message.ShouldNotContain(When_association_subclass_has_multiple_duplicate_property_names._not_duplicate_property_name);
            });
});
});