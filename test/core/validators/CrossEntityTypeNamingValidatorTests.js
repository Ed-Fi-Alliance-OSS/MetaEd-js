"use strict";
/// <reference path="../../../../typings/index.d.ts" />
const chai = require('chai');
let should = chai.should();
describe('ReplaceMeWithFileName', () => {
    let validatorListener = new ValidatorListener(new TestRuleProvider(new ReplaceMeWithFileName()));
    const _entityName = "MyIdentifier";
    let propertyName = "Property1";
}, protected, _symbolTable, SymbolTable);
_warningMessageCollection: List();
_errorMessageCollection: List();
_metaEdContext: MetaEdGrammar.MetaEdContext;
getSource();
string;
{
    throw new Error('not implemented');
}
;
setup();
void {
    let: source = GetSource(),
    Console: .WriteLine(source),
    let: metaEdFileIndex = new SingleFileMetaEdFileIndex(),
    metaEdFileIndex: .Add(source),
    let: antlrInputStream = new AntlrInputStream(source),
    let: lexer = new BaseLexer(antlrInputStream),
    let: tokens = new CommonTokenStream(lexer),
    let: parser = new MetaEdGrammar(tokens),
    this: ._metaEdContext = parser.metaEd(),
    this: ._symbolTable = new SymbolTable(),
    let: context = new MetaEdContext(metaEdFileIndex, this._symbolTable),
    let: validator = new CrossEntityTypeNamingValidator(),
    validator: 
        .withContext(context),
    let: builder = new SymbolTableBuilder(validator),
    builder: 
        .withContext(context),
    ParseTreeWalker: .Default.Walk(builder, this._metaEdContext),
    this: ._warningMessageCollection = context.WarningMessageCollection,
    this: ._errorMessageCollection = context.ErrorMessageCollection
};
;
;
getSource();
string;
{
    before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt
            .withBeginNamespace("edfi")
            .withStartDomainEntity(When_entities_have_different_names._entityName)
            .withDocumentation("because documentation is required")
            .withBooleanProperty(propertyName, "because a property is required", true, false)
            .withEndDomainEntity()
            .withStartAbstractEntity("DifferentName")
            .withDocumentation("because documentation is required")
            .withBooleanProperty(propertyName, "because a property is required", true, false)
            .withEndAbstractEntity()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
    should_not_report_error();
    void {
        this: ._errorMessageCollection.Count.ShouldEqual(0)
    };
    ;
}
;
getSource();
string;
{
    before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt
            .withBeginNamespace("edfi")
            .withStartDomainEntity(When_entities_have_same_name._entityName)
            .withDocumentation("because documentation is required")
            .withBooleanProperty(propertyName, "because a property is required", true, false)
            .withEndDomainEntity()
            .withStartAbstractEntity(When_entities_have_same_name._entityName)
            .withDocumentation("because documentation is required")
            .withBooleanProperty(propertyName, "because a property is required", true, false)
            .withEndAbstractEntity()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
    should_report_the_duplicate();
    void {
        this: ._errorMessageCollection.Count.ShouldEqual(1),
        let: failure = this._errorMessageCollection[0],
        failure: .Message.ShouldContain(When_entities_have_same_name._entityName),
        failure: .Message.ShouldContain("duplicate")
    };
    ;
    should_report_position_of_error();
    void {
        this: ._errorMessageCollection.Count.ShouldEqual(1),
        let: failure = this._errorMessageCollection[0],
        failure: .ConcatenatedLineNumber.ShouldEqual(9),
        failure: .CharacterPosition.ShouldEqual(18)
    };
    ;
}
;
getSource();
string;
{
    before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt
            .withBeginNamespace("edfi")
            .withStartDomainEntity(When_domain_entity_has_same_name_as_extension._entityName)
            .withDocumentation("because documentation is required")
            .withBooleanProperty(propertyName, "because a property is required", true, false)
            .withEndDomainEntity()
            .withStartDomainEntityExtension(When_domain_entity_has_same_name_as_extension._entityName)
            .withBooleanProperty(propertyName, "because a property is required", true, false)
            .withEndAbstractEntity()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
    should_not_report_error();
    void {
        this: ._errorMessageCollection.Count.ShouldEqual(0)
    };
    ;
}
;
getSource();
string;
{
    before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt
            .withBeginNamespace("edfi")
            .withStartAssociation(When_association_has_same_name_as_extension._entityName)
            .withDocumentation("because documentation is required")
            .withDomainEntityProperty("Association1", "because a property is required")
            .withDomainEntityProperty("Association2", "because a property is required")
            .withEndAssociation()
            .withStartAssociationExtension(When_association_has_same_name_as_extension._entityName)
            .withDateProperty("BeginDate", "doc", true, false)
            .withDateProperty("EndDate", "doc", true, false)
            .withEndAssociationExtension()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
    should_not_report_error();
    void {
        this: ._errorMessageCollection.Count.ShouldEqual(0)
    };
    ;
}
;
getSource();
string;
{
    before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt
            .withBeginNamespace("edfi")
            .withStartDomainEntity(When_domain_entity_has_same_name_as_common_simple_type._entityName)
            .withDocumentation("doc")
            .withBooleanProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withStartCommonInteger(When_domain_entity_has_same_name_as_common_simple_type._entityName)
            .withDocumentation("doc")
            .withMinValue("0")
            .withEndCommonInteger()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
    should_report_the_duplicate();
    void {
        this: ._errorMessageCollection.Count.ShouldEqual(1),
        let: failure = this._errorMessageCollection[0],
        failure: .Message.ShouldContain(When_domain_entity_has_same_name_as_common_simple_type._entityName),
        failure: .Message.ShouldContain("duplicate")
    };
    ;
    should_report_position_of_error();
    void {
        this: ._errorMessageCollection.Count.ShouldEqual(1),
        let: failure = this._errorMessageCollection[0],
        failure: .ConcatenatedLineNumber.ShouldEqual(9),
        failure: .CharacterPosition.ShouldEqual(17)
    };
    ;
}
;
getSource();
string;
{
    before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt
            .withBeginNamespace("edfi")
            .withStartDomainEntity(When_domain_entity_has_same_name_as_descriptor._entityName)
            .withDocumentation("doc")
            .withBooleanProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withStartDescriptor(When_domain_entity_has_same_name_as_descriptor._entityName)
            .withDocumentation("doc")
            .withBooleanProperty("Property1", "doc", false, false)
            .withEndDescriptor()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
    should_not_report_error_on_duplication_of_descriptor_name();
    void {
        this: ._errorMessageCollection.Count.ShouldEqual(0)
    };
    ;
}
;
getSource();
string;
{
    before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt
            .withBeginNamespace("edfi")
            .withStartDomainEntity(When_domain_entity_has_same_name_as_enumeration._entityName)
            .withDocumentation("doc")
            .withBooleanProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withStartEnumeration(When_domain_entity_has_same_name_as_enumeration._entityName)
            .withDocumentation("doc")
            .withEnumerationItem("ShortDescription", "doc")
            .withEndEnumeration()
            .withEndNamespace();
        helper.setup(metaEdText, validatorListener);
    });
    should_not_report_error_on_duplication_of_enumeration_name();
    void {
        this: ._errorMessageCollection.Count.ShouldEqual(0)
    };
    ;
}
;
getSource();
string;
{
    before(() => {
        let metaEdText = MetaEdTextBuilder.buildIt
            .withBeginNamespace("edfi")
            .withStartDomainEntity(When_domain_entity_has_same_name_as_interchange._entityName)
            .withDocumentation("doc")
            .withBooleanProperty(propertyName, "doc", true, false)
            .withEndDomainEntity()
            .withStartInterchange(When_domain_entity_has_same_name_as_interchange._entityName)
            .withDocumentation("doc")
            .withElement(When_domain_entity_has_same_name_as_interchange._entityName)
            .withEndInterchange();
        helper.setup(metaEdText, validatorListener);
    });
    should_not_report_error_on_duplication_of_interchange_name();
    void {
        this: ._errorMessageCollection.Count.ShouldEqual(0)
    };
    ;
}
;
;
//# sourceMappingURL=CrossEntityTypeNamingValidatorTests.js.map