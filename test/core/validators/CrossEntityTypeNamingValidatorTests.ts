module MetaEd.Tests.Validator {
    export class CrossEntityTypeNamingValidatorTests {

    }
    export module CrossEntityTypeNamingValidatorTests {
        export class BaseCrossEntityTypeNamingValidatorTests {
            protected static _entityName: string = "MyIdentifier";
            protected static _propertyName: string = "Property1";
            protected _symbolTable: SymbolTable;
            protected _warningMessageCollection: List<ValidationMessage>;
            protected _errorMessageCollection: List<ValidationMessage>;
            protected _metaEdContext: MetaEdGrammar.MetaEdContext;
            public getSource(): string { throw new Error('not implemented'); }
            public setup(): void {
                var source = GetSource();
                Console.WriteLine(source);
                var metaEdFileIndex = new SingleFileMetaEdFileIndex();
                metaEdFileIndex.Add(source);
                var antlrInputStream = new AntlrInputStream(source);
                var lexer = new BaseLexer(antlrInputStream);
                var tokens = new CommonTokenStream(lexer);
                var parser = new MetaEdGrammar(tokens);
                this._metaEdContext = parser.metaEd();
                this._symbolTable = new SymbolTable();
                var context = new MetaEdContext(metaEdFileIndex, this._symbolTable);
                var validator = new CrossEntityTypeNamingValidator();
                validator.WithContext(context);
                var builder = new SymbolTableBuilder(validator);
                builder.WithContext(context);
                ParseTreeWalker.Default.Walk(builder, this._metaEdContext);
                this._warningMessageCollection = context.WarningMessageCollection;
                this._errorMessageCollection = context.ErrorMessageCollection;
            }
        }
    }
    export module CrossEntityTypeNamingValidatorTests {
        /*[TestFixture]*/
        export class When_entities_have_different_names extends BaseCrossEntityTypeNamingValidatorTests {
            public getSource(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_entities_have_different_names._entityName).WithDocumentation("because documentation is required").WithBooleanProperty(When_entities_have_different_names._propertyName, "because a property is required", true, false).WithEndDomainEntity();
                metaEdTextBuilder.WithStartAbstractEntity("DifferentName").WithDocumentation("because documentation is required").WithBooleanProperty(When_entities_have_different_names._propertyName, "because a property is required", true, false).WithEndAbstractEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            public should_not_report_error(): void {
                this._errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module CrossEntityTypeNamingValidatorTests {
        /*[TestFixture]*/
        export class When_entities_have_same_name extends BaseCrossEntityTypeNamingValidatorTests {
            public getSource(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_entities_have_same_name._entityName).WithDocumentation("because documentation is required").WithBooleanProperty(When_entities_have_same_name._propertyName, "because a property is required", true, false).WithEndDomainEntity();
                metaEdTextBuilder.WithStartAbstractEntity(When_entities_have_same_name._entityName).WithDocumentation("because documentation is required").WithBooleanProperty(When_entities_have_same_name._propertyName, "because a property is required", true, false).WithEndAbstractEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            public should_report_the_duplicate(): void {
                this._errorMessageCollection.Count.ShouldEqual(1);
                var failure = this._errorMessageCollection[0];
                failure.Message.ShouldContain(When_entities_have_same_name._entityName);
                failure.Message.ShouldContain("duplicate");
            }
            public should_report_position_of_error(): void {
                this._errorMessageCollection.Count.ShouldEqual(1);
                var failure = this._errorMessageCollection[0];
                failure.ConcatenatedLineNumber.ShouldEqual(9);
                failure.CharacterPosition.ShouldEqual(18);
            }
        }
    }
    export module CrossEntityTypeNamingValidatorTests {
        /*[TestFixture]*/
        export class When_domain_entity_has_same_name_as_extension extends BaseCrossEntityTypeNamingValidatorTests {
            public getSource(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_has_same_name_as_extension._entityName).WithDocumentation("because documentation is required").WithBooleanProperty(When_domain_entity_has_same_name_as_extension._propertyName, "because a property is required", true, false).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDomainEntityExtension(When_domain_entity_has_same_name_as_extension._entityName).WithBooleanProperty(When_domain_entity_has_same_name_as_extension._propertyName, "because a property is required", true, false).WithEndAbstractEntity().WithEndNamespace();
                return metaEdTextBuilder;
            }
            public should_not_report_error(): void {
                this._errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module CrossEntityTypeNamingValidatorTests {
        /*[TestFixture]*/
        export class When_association_has_same_name_as_extension extends BaseCrossEntityTypeNamingValidatorTests {
            public getSource(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartAssociation(When_association_has_same_name_as_extension._entityName).WithDocumentation("because documentation is required").WithDomainEntityProperty("Association1", "because a property is required").WithDomainEntityProperty("Association2", "because a property is required").WithEndAssociation();
                metaEdTextBuilder.WithStartAssociationExtension(When_association_has_same_name_as_extension._entityName).WithDateProperty("BeginDate", "doc", true, false).WithDateProperty("EndDate", "doc", true, false).WithEndAssociationExtension().WithEndNamespace();
                return metaEdTextBuilder;
            }
            public should_not_report_error(): void {
                this._errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module CrossEntityTypeNamingValidatorTests {
        /*[TestFixture]*/
        export class When_domain_entity_has_same_name_as_common_simple_type extends BaseCrossEntityTypeNamingValidatorTests {
            public getSource(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_has_same_name_as_common_simple_type._entityName).WithDocumentation("doc").WithBooleanProperty(When_domain_entity_has_same_name_as_common_simple_type._propertyName, "doc", true, false).WithEndDomainEntity();
                metaEdTextBuilder.WithStartCommonInteger(When_domain_entity_has_same_name_as_common_simple_type._entityName).WithDocumentation("doc").WithMinValue("0").WithEndCommonInteger().WithEndNamespace();
                return metaEdTextBuilder;
            }
            public should_report_the_duplicate(): void {
                this._errorMessageCollection.Count.ShouldEqual(1);
                var failure = this._errorMessageCollection[0];
                failure.Message.ShouldContain(When_domain_entity_has_same_name_as_common_simple_type._entityName);
                failure.Message.ShouldContain("duplicate");
            }
            public should_report_position_of_error(): void {
                this._errorMessageCollection.Count.ShouldEqual(1);
                var failure = this._errorMessageCollection[0];
                failure.ConcatenatedLineNumber.ShouldEqual(9);
                failure.CharacterPosition.ShouldEqual(17);
            }
        }
    }
    export module CrossEntityTypeNamingValidatorTests {
        /*[TestFixture]*/
        export class When_domain_entity_has_same_name_as_descriptor extends BaseCrossEntityTypeNamingValidatorTests {
            public getSource(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_has_same_name_as_descriptor._entityName).WithDocumentation("doc").WithBooleanProperty(When_domain_entity_has_same_name_as_descriptor._propertyName, "doc", true, false).WithEndDomainEntity();
                metaEdTextBuilder.WithStartDescriptor(When_domain_entity_has_same_name_as_descriptor._entityName).WithDocumentation("doc").WithBooleanProperty("Property1", "doc", false, false).WithEndDescriptor().WithEndNamespace();
                return metaEdTextBuilder;
            }
            public should_not_report_error_on_duplication_of_descriptor_name(): void {
                this._errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module CrossEntityTypeNamingValidatorTests {
        /*[TestFixture]*/
        export class When_domain_entity_has_same_name_as_enumeration extends BaseCrossEntityTypeNamingValidatorTests {
            public getSource(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_has_same_name_as_enumeration._entityName).WithDocumentation("doc").WithBooleanProperty(When_domain_entity_has_same_name_as_enumeration._propertyName, "doc", true, false).WithEndDomainEntity();
                metaEdTextBuilder.WithStartEnumeration(When_domain_entity_has_same_name_as_enumeration._entityName).WithDocumentation("doc").WithEnumerationItem("ShortDescription", "doc").WithEndEnumeration().WithEndNamespace();
                return metaEdTextBuilder;
            }
            public should_not_report_error_on_duplication_of_enumeration_name(): void {
                this._errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
    export module CrossEntityTypeNamingValidatorTests {
        /*[TestFixture]*/
        export class When_domain_entity_has_same_name_as_interchange extends BaseCrossEntityTypeNamingValidatorTests {
            public getSource(): string {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder.WithBeginNamespace("edfi").WithStartDomainEntity(When_domain_entity_has_same_name_as_interchange._entityName).WithDocumentation("doc").WithBooleanProperty(When_domain_entity_has_same_name_as_interchange._propertyName, "doc", true, false).WithEndDomainEntity();
                metaEdTextBuilder.WithStartInterchange(When_domain_entity_has_same_name_as_interchange._entityName).WithDocumentation("doc").WithElement(When_domain_entity_has_same_name_as_interchange._entityName).WithEndInterchange();
                return metaEdTextBuilder;
            }
            public should_not_report_error_on_duplication_of_interchange_name(): void {
                this._errorMessageCollection.Count.ShouldEqual(0);
            }
        }
    }
}