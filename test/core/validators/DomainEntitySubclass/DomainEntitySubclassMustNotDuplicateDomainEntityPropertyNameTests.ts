/// <reference path="../../../../typings/index.d.ts" />
import MetaEdTextBuilder from "../../../grammar/MetaEdTextBuilder";
import chai = require('chai');
import {ValidatorTestHelper} from "../ValidatorTestHelper";
import {ValidatorListener} from "../../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "../TestRuleProvider";
import {DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName}from "../../../../src/core/validators/DomainEntitySubclass/DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName"

let should = chai.should();

describe('DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName', () => { 
	let validatorListener = new ValidatorListener(
        new TestRuleProvider<MetaEdGrammar.DomainEntitySubclassContext>(
            new DomainEntitySubclassMustNotDuplicateDomainEntityPropertyName(helper.symbolTable)));
    
        
        describe('When_domain_entity_subclass_has_different_property_name', () => {
            let entityName: string = "SubclassIdentifier";
            let baseName: string = "BaseDomainEntityIdentifier";
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.buildIt
                
.withBeginNamespace("edfi")
.withStartDomainEntity(baseName)
.withDocumentation("because documentation is required")
.withBooleanProperty("Property1", "because a property is required", true, false)
.withEndDomainEntity()
                
.withStartDomainEntitySubclass(entityName, baseName)
.withDocumentation("because documentation is required")
.withBooleanProperty("Property2", "because a property is required", true, false)
.withEndDomainEntitySubclass()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_no_validation_failures()', () => {
                helper.errorMessageCollection.length.should.equal(0);
            });
});
    
        
        describe('When_domain_entity_subclass_has_duplicate_property_name', () => {
            let entityName: string = "MyIdentifier";
            let baseName: string = "BaseIdentifier";
            const duplicatePropertyName: string = "Property1";
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.buildIt
                
.withBeginNamespace("edfi")
.withStartDomainEntity(baseName)
.withDocumentation("because documentation is required")
.withBooleanProperty(duplicatePropertyName, "because a property is required", true, false)
.withEndDomainEntity()
                
.withStartDomainEntitySubclass(entityName, baseName)
.withDocumentation("because documentation is required")
.withBooleanProperty(duplicatePropertyName, "because a property is required", true, false)
.withEndDomainEntitySubclass()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_validation_failure()', () => {
                helper.errorMessageCollection.Any().ShouldBeTrue();
            });
            it('should_have_validation_failure_message()', () => {
                helper.errorMessageCollection[0].Message.ShouldContain("DomainEntity");
                helper.errorMessageCollection[0].Message.ShouldContain(entityName);
                helper.errorMessageCollection[0].Message.ShouldContain("based on");
                helper.errorMessageCollection[0].Message.ShouldContain(baseName);
                helper.errorMessageCollection[0].Message.ShouldContain(duplicatePropertyName);
                helper.errorMessageCollection[0].Message.ShouldContain("already in property list");
            });
});
    
        
        describe('When_domain_entity_subclass_has_multiple_duplicate_property_names', () => {
            let entityName: string = "MyIdentifier";
            let baseName: string = "BaseIdentifier";
            const notDuplicatePropertyName: string = "NotADuplicate";
            const duplicatePropertyName1: string = "Property1";
            const duplicatePropertyName2: string = "Property2";
            let helper: ValidatorTestHelper = new ValidatorTestHelper();
                before(() => { 
 let metaEdText = MetaEdTextBuilder.buildIt
                
.withBeginNamespace("edfi")
.withStartDomainEntity(baseName)
.withDocumentation("because documentation is required")
.withBooleanProperty(duplicatePropertyName1, "because a property is required", true, false)
.withBooleanProperty(duplicatePropertyName2, "because a property is required", true, false)
.withEndDomainEntity()
                
.withStartDomainEntitySubclass(entityName, baseName)
.withDocumentation("because documentation is required")
.withBooleanProperty(duplicatePropertyName1, "because a property is required", true, false)
.withBooleanProperty(duplicatePropertyName2, "because a property is required", true, false)
.withBooleanProperty(notDuplicatePropertyName, "because a property is required", true, false)
.withEndDomainEntitySubclass()
.withEndNamespace().toString();
                helper.setup(metaEdText, validatorListener);
            });
            
            it('should_have_validation_failure()', () => {
                helper.errorMessageCollection.Any().ShouldBeTrue();
            });
            it('should_have_validation_failure_message()', () => {
                helper.errorMessageCollection[0].Message.ShouldContain("DomainEntity");
                helper.errorMessageCollection[0].Message.ShouldContain(entityName);
                helper.errorMessageCollection[0].Message.ShouldContain("based on");
                helper.errorMessageCollection[0].Message.ShouldContain(baseName);
                helper.errorMessageCollection[0].Message.ShouldContain(duplicatePropertyName1);
                helper.errorMessageCollection[0].Message.ShouldContain(duplicatePropertyName2);
                helper.errorMessageCollection[0].Message.ShouldContain("already in property list");
                helper.errorMessageCollection[0].Message.ShouldNotContain(notDuplicatePropertyName);
            });
});
});