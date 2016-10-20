//TODO: This looks like a different testing pattern


////import chai from 'chai'
//import ValidatorTestHelper from "../ValidatorTestHelper";
//
//chai.should();
//
//describe('ReplaceMeWithFileName', () => {
//    let validatorListener = new ValidatorListener(
//        new TestRuleProvider<MetaEdGrammar.ReplaceMeWithContext>(
//            new ReplaceMeWithFileName()));
//
//
//    const _entityName: string = "MyIdentifier";
//    let propertyName: string = "Property1";
//            protected _symbolTable: SymbolTable;
//            protected _warningMessageCollection: ValidationMessage[];
//            protected _errorMessageCollection: ValidationMessage[];
//            protected _metaEdContext: MetaEdGrammar.MetaEdContext;
//            public getSource(): string { throw new Error('not implemented'); });
//            public setup(): void {
//    let source = GetSource();
//    Console.WriteLine(source);
//    let metaEdFileIndex = new SingleFileMetaEdFileIndex();
//    metaEdFileIndex.Add(source);
//    let antlrInputStream = new AntlrInputStream(source);
//    let lexer = new BaseLexer(antlrInputStream);
//    let tokens = new CommonTokenStream(lexer);
//    let parser = new MetaEdGrammar(tokens);
//    this._metaEdContext = parser.metaEd();
//    this._symbolTable = new SymbolTable();
//    let context = new MetaEdContext(metaEdFileIndex, this._symbolTable);
//    let validator = new CrossEntityTypeNamingValidator();
//    validator
//.withContext(context);
//    let builder = new SymbolTableBuilder(validator);
//    builder
//.withContext(context);
//    ParseTreeWalker.Default.Walk(builder, this._metaEdContext);
//    this._warningMessageCollection = context.WarningMessageCollection;
//    this._errorMessageCollection = context.ErrorMessageCollection;
//});
//});
//    
//        
//        
//            public getSource(): string {
//    before(() => {
//        let metaEdText = MetaEdTextBuilder.build()
//
//            .withBeginNamespace("edfi")
//            .withStartDomainEntity(When_entities_have_different_names._entityName)
//            .withDocumentation("because documentation is required")
//            .withBooleanProperty(propertyName, "because a property is required", true, false)
//            .withEndDomainEntity()
//
//            .withStartAbstractEntity("DifferentName")
//            .withDocumentation("because documentation is required")
//            .withBooleanProperty(propertyName, "because a property is required", true, false)
//            .withEndAbstractEntity()
//            .withEndNamespace().toString();
//        helper.setup(metaEdText, validatorListener);
//    });
//            public should_not_report_error(): void {
//        this._errorMessageCollection.length.should.equal(0);
//    });
//});
//    
//        
//        
//            public getSource(): string {
//    before(() => {
//        let metaEdText = MetaEdTextBuilder.build()
//
//            .withBeginNamespace("edfi")
//            .withStartDomainEntity(When_entities_have_same_name._entityName)
//            .withDocumentation("because documentation is required")
//            .withBooleanProperty(propertyName, "because a property is required", true, false)
//            .withEndDomainEntity()
//
//            .withStartAbstractEntity(When_entities_have_same_name._entityName)
//            .withDocumentation("because documentation is required")
//            .withBooleanProperty(propertyName, "because a property is required", true, false)
//            .withEndAbstractEntity()
//            .withEndNamespace().toString();
//        helper.setup(metaEdText, validatorListener);
//    });
//            public should_report_the_duplicate(): void {
//        this._errorMessageCollection.length.should.equal(1);
//        let failure = this._errorMessageCollection[0];
//        failure.message.should.include(When_entities_have_same_name._entityName);
//        failure.message.should.include("duplicate");
//    });
//            public should_report_position_of_error(): void {
//        this._errorMessageCollection.length.should.equal(1);
//        let failure = this._errorMessageCollection[0];
//        failure.ConcatenatedLineNumber.should.equal(9);
//        failure.CharacterPosition.should.equal(18);
//    });
//});
//    
//        
//        
//            public getSource(): string {
//    before(() => {
//        let metaEdText = MetaEdTextBuilder.build()
//
//            .withBeginNamespace("edfi")
//            .withStartDomainEntity(When_domain_entity_has_same_name_as_extension._entityName)
//            .withDocumentation("because documentation is required")
//            .withBooleanProperty(propertyName, "because a property is required", true, false)
//            .withEndDomainEntity()
//
//            .withStartDomainEntityExtension(When_domain_entity_has_same_name_as_extension._entityName)
//            .withBooleanProperty(propertyName, "because a property is required", true, false)
//            .withEndAbstractEntity()
//            .withEndNamespace().toString();
//        helper.setup(metaEdText, validatorListener);
//    });
//            public should_not_report_error(): void {
//        this._errorMessageCollection.length.should.equal(0);
//    });
//});
//    
//        
//        
//            public getSource(): string {
//    before(() => {
//        let metaEdText = MetaEdTextBuilder.build()
//
//            .withBeginNamespace("edfi")
//            .withStartAssociation(When_association_has_same_name_as_extension._entityName)
//            .withDocumentation("because documentation is required")
//            .withDomainEntityProperty("Association1", "because a property is required")
//            .withDomainEntityProperty("Association2", "because a property is required")
//            .withEndAssociation()
//
//            .withStartAssociationExtension(When_association_has_same_name_as_extension._entityName)
//            .withDateProperty("BeginDate", "doc", true, false)
//            .withDateProperty("EndDate", "doc", true, false)
//            .withEndAssociationExtension()
//            .withEndNamespace().toString();
//        helper.setup(metaEdText, validatorListener);
//    });
//            public should_not_report_error(): void {
//        this._errorMessageCollection.length.should.equal(0);
//    });
//});
//    
//        
//        
//            public getSource(): string {
//    before(() => {
//        let metaEdText = MetaEdTextBuilder.build()
//
//            .withBeginNamespace("edfi")
//            .withStartDomainEntity(When_domain_entity_has_same_name_as_common_simple_type._entityName)
//            .withDocumentation("doc")
//            .withBooleanProperty(propertyName, "doc", true, false)
//            .withEndDomainEntity()
//
//            .withStartCommonInteger(When_domain_entity_has_same_name_as_common_simple_type._entityName)
//            .withDocumentation("doc")
//            .withMinValue("0")
//            .withEndCommonInteger()
//            .withEndNamespace().toString();
//        helper.setup(metaEdText, validatorListener);
//    });
//            public should_report_the_duplicate(): void {
//        this._errorMessageCollection.length.should.equal(1);
//        let failure = this._errorMessageCollection[0];
//        failure.message.should.include(When_domain_entity_has_same_name_as_common_simple_type._entityName);
//        failure.message.should.include("duplicate");
//    });
//            public should_report_position_of_error(): void {
//        this._errorMessageCollection.length.should.equal(1);
//        let failure = this._errorMessageCollection[0];
//        failure.ConcatenatedLineNumber.should.equal(9);
//        failure.CharacterPosition.should.equal(17);
//    });
//});
//    
//        
//        
//            public getSource(): string {
//    before(() => {
//        let metaEdText = MetaEdTextBuilder.build()
//
//            .withBeginNamespace("edfi")
//            .withStartDomainEntity(When_domain_entity_has_same_name_as_descriptor._entityName)
//            .withDocumentation("doc")
//            .withBooleanProperty(propertyName, "doc", true, false)
//            .withEndDomainEntity()
//
//            .withStartDescriptor(When_domain_entity_has_same_name_as_descriptor._entityName)
//            .withDocumentation("doc")
//            .withBooleanProperty("Property1", "doc", false, false)
//            .withEndDescriptor()
//            .withEndNamespace().toString();
//        helper.setup(metaEdText, validatorListener);
//    });
//            public should_not_report_error_on_duplication_of_descriptor_name(): void {
//        this._errorMessageCollection.length.should.equal(0);
//    });
//});
//    
//        
//        
//            public getSource(): string {
//    before(() => {
//        let metaEdText = MetaEdTextBuilder.build()
//
//            .withBeginNamespace("edfi")
//            .withStartDomainEntity(When_domain_entity_has_same_name_as_enumeration._entityName)
//            .withDocumentation("doc")
//            .withBooleanProperty(propertyName, "doc", true, false)
//            .withEndDomainEntity()
//
//            .withStartEnumeration(When_domain_entity_has_same_name_as_enumeration._entityName)
//            .withDocumentation("doc")
//            .withEnumerationItem("ShortDescription", "doc")
//            .withEndEnumeration()
//            .withEndNamespace().toString();
//        helper.setup(metaEdText, validatorListener);
//    });
//            public should_not_report_error_on_duplication_of_enumeration_name(): void {
//        this._errorMessageCollection.length.should.equal(0);
//    });
//});
//    
//        
//        
//            public getSource(): string {
//    before(() => {
//        let metaEdText = MetaEdTextBuilder.build()
//
//            .withBeginNamespace("edfi")
//            .withStartDomainEntity(When_domain_entity_has_same_name_as_interchange._entityName)
//            .withDocumentation("doc")
//            .withBooleanProperty(propertyName, "doc", true, false)
//            .withEndDomainEntity()
//
//            .withStartInterchange(When_domain_entity_has_same_name_as_interchange._entityName)
//            .withDocumentation("doc")
//            .withElement(When_domain_entity_has_same_name_as_interchange._entityName)
//            .withEndInterchange();
//        helper.setup(metaEdText, validatorListener);
//    });
//            public should_not_report_error_on_duplication_of_interchange_name(): void {
//        this._errorMessageCollection.length.should.equal(0);
//    });
//});
//});