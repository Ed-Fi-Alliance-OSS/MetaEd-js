/// <reference path="../../../typings/index.d.ts" />

import MetaEdTextBuilder from '../MetaEdTextBuilder';
import MetaEdGrammarHelper from "./ParserTestHelper";

import chai = require('chai');
let should = chai.should();

describe('AbstractEntityTests', () => {

    describe('When_parsing_abstract_entity_with_name_documentation_and_property', () => {

        const  _entity_name: string = "MyIdentifier";
        const  _documentation1: string  = "line 1 of documentation";
        const  _documentation2: string = "another line of intervention documentation";
        const  _property_name: string = "Property1";
        const  _property_documentation: string = "property intervention documentation";

        const metaEdTextBuilder: MetaEdTextBuilder = new MetaEdTextBuilder();
        const inputText: string = metaEdTextBuilder
            .withStartAbstractEntity(_entity_name)
            .withMetaEdId("100")
            .withDocumentation(_documentation1,_documentation2)
            .withStringProperty(_property_name, _property_documentation, true, false, 100)
            .withEndAbstractEntity()
            .toString();

        let _context;

        before( () => {
            const parser = MetaEdGrammarHelper.parse(inputText);
            _context = parser.abstractEntity();
            //console.log(MetaEdGrammarHelper.toStringTree(_context, parser));
        });

        it('Should_successfully_parse', () => {
            should.exist(_context);
            should.not.exist(_context.exception);
            MetaEdGrammarHelper.hasErrors(_context).should.be.false;
        });
    });
});

/*
    public class AbstractEntityTests
    {
        [TestFixture]
        public class When_parsing_abstract_entity_with_name_documentation_and_property : BaseParserTest
        {

            [Test]
            public void Should_parse_entity_name()
            {
                var entityName = _testRuleContext.abstractEntityName();
                entityName.ShouldNotBeNull();
                entityName.exception.ShouldBeNull();
                entityName.ID().Symbol.Text.ShouldEqual(_entity_name);
            }

            [Test]
            public void Should_parse_documentation()
            {
                var documentation = _testRuleContext.documentation();
                documentation.ShouldNotBeNull();
                documentation.exception.ShouldBeNull();

                var documentationLine = documentation.documentationLine();
                documentationLine.Length.ShouldEqual(2);
                documentationLine[0].exception.ShouldBeNull();
                documentationLine[1].exception.ShouldBeNull();
            }

            [Test]
            public void Should_parse_properties_collection()
            {
                var properties = _testRuleContext.property();
                properties.ShouldNotBeNull();
                properties.Length.ShouldEqual(1);
                properties[0].exception.ShouldBeNull();
            }

            [Test]
            public void Should_parse_metaedId()
            {
                _testRuleContext.ShouldNotBeNull();
                _testRuleContext.metaEdId().ShouldNotBeNull();
                _testRuleContext.metaEdId().METAED_ID().GetText().ShouldEqual("100");
            }
        }
/////
        [TestFixture]
        public class When_parsing_abstract_entity_with_extra_blank_lines : BaseParserTest
        {
            private const string _entity_name = "MyIdentifier";
            private const string _documentation1 = "line 1 of documentation";
            private const string _documentation2 = "another line of intervention documentation";
            private const string _property_name = "Property1";
            private const string _property_documentation = "property intervention documentation";

            private AbstractEntity.AbstractEntityContext _testRuleContext;
            private string _formattedStringTree;

            protected override MetaEdTextBuilder BuildMetaEdText()
            {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder
                                  .WithStartAbstractEntity(_entity_name)
                                  .WithDocumentation(_documentation1,_documentation2)
                                  .WithStringProperty(_property_name, _property_documentation, true, false, 100)
                                  .WithEndAbstractEntity()
                                  ;
                return metaEdTextBuilder;
            }

            protected override ITokenSource BuildLexer(ICharStream input)
            {
                return new BaseLexer(input);
            }

            protected override ParserRuleContext RunParser(ITokenStream tokenStream)
            {
                var parser = new AbstractEntity(tokenStream);
                _testRuleContext = parser.abstractEntity();
                _formattedStringTree = _testRuleContext.ToStringWithRuleAndTokenNames(parser);
                return _testRuleContext;
            }

            [Test]
            public void Should_successfully_parse()
            {
                _context.ShouldNotBeNull();
                Console.WriteLine(_formattedStringTree);
                _context.HasErrors().ShouldBeFalse();
            }

            [Test]
            public void Should_parse_abstract_entity()
            {
                var abstractEntity = _testRuleContext;
                abstractEntity.ShouldNotBeNull();
                abstractEntity.exception.ShouldBeNull();
            }

            [Test]
            public void Should_parse_entity_name()
            {
                var entityName = _testRuleContext.abstractEntityName();
                entityName.ShouldNotBeNull();
                entityName.exception.ShouldBeNull();
                entityName.ID().Symbol.Text.ShouldEqual(_entity_name);
            }

            [Test]
            public void Should_parse_documentation()
            {
                var documentation = _testRuleContext.documentation();
                documentation.ShouldNotBeNull();
                documentation.exception.ShouldBeNull();

                var documentationLine = documentation.documentationLine();
                documentationLine.Length.ShouldEqual(2);
                documentationLine[0].exception.ShouldBeNull();
                documentationLine[1].exception.ShouldBeNull();
            }

            [Test]
            public void Should_parse_properties_collection()
            {
                var properties = _testRuleContext.property();
                properties.ShouldNotBeNull();
                properties.Length.ShouldEqual(1);
                properties[0].exception.ShouldBeNull();
            }
        }

        [TestFixture]
        public class When_parsing_abstract_entity_with_identity_property : BaseParserTest
        {
            private const string _entity_name = "MyIdentifier";
            private const string _documentation1 = "line 1 of documentation";
            private const string _documentation2 = "another line of intervention documentation";
            private const string _property_name = "Property1";
            private const string _property_documentation = "property intervention documentation";

            private AbstractEntity.AbstractEntityContext _testRuleContext;
            private string _formattedStringTree;

            protected override MetaEdTextBuilder BuildMetaEdText()
            {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder
                                  .WithStartAbstractEntity(_entity_name)
                                  .WithDocumentation(_documentation1,_documentation2)
                                  .WithStringIdentity(_property_name, _property_documentation, 100)
                                  .WithEndAbstractEntity()
                                  ;
                return metaEdTextBuilder;
            }

            protected override ITokenSource BuildLexer(ICharStream input)
            {
                return new BaseLexer(input);
            }

            protected override ParserRuleContext RunParser(ITokenStream tokenStream)
            {
                var parser = new AbstractEntity(tokenStream);
                _testRuleContext = parser.abstractEntity();
                _formattedStringTree = _testRuleContext.ToStringWithRuleAndTokenNames(parser);
                return _testRuleContext;
            }

            [Test]
            public void Should_successfully_parse()
            {
                _context.ShouldNotBeNull();
                Console.WriteLine(_formattedStringTree);
                _context.HasErrors().ShouldBeFalse();
            }

            [Test]
            public void Should_allow_identity()
            {
                _testRuleContext.property(0).stringProperty().propertyComponents().propertyAnnotation().identity().ShouldNotBeNull();
                _testRuleContext.property(0).stringProperty().propertyComponents().propertyAnnotation().identity().exception.ShouldBeNull();
            }
        }

        [TestFixture]
        public class When_parsing_abstract_entity_with_no_properties : BaseParserTest
        {
            private const string _entity_name = "MyIdentifier";
            private const string _documentation = "line 1 of documentation";
            private AbstractEntity.AbstractEntityContext _testRuleContext;
            private string _formattedStringTree;

            protected override MetaEdTextBuilder BuildMetaEdText()
            {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder
                                  .WithStartAbstractEntity(_entity_name)
                                  .WithDocumentation(_documentation)
                                  .WithEndAbstractEntity()
                                  ;
                return metaEdTextBuilder;
            }

            protected override ITokenSource BuildLexer(ICharStream input)
            {
                return new BaseLexer(input);
            }

            protected override ParserRuleContext RunParser(ITokenStream tokenStream)
            {
                var parser = new AbstractEntity(tokenStream);
                _testRuleContext = parser.abstractEntity();
                _formattedStringTree = _testRuleContext.ToStringWithRuleAndTokenNames(parser);
                return _testRuleContext;
            }

            [Test]
            public void Should_not_successfully_parse()
            {
                _context.ShouldNotBeNull();
                Console.WriteLine(_formattedStringTree);
                _context.HasErrors().ShouldBeTrue();
            }

            [Test]
            public void Should_parse_abstract_entity()
            {
                var abstractEntity = _testRuleContext;
                abstractEntity.ShouldNotBeNull();
                abstractEntity.exception.ShouldBeNull();
            }

            [Test]
            public void Should_parse_entity_name()
            {
                var entityName = _testRuleContext.abstractEntityName();
                entityName.ShouldNotBeNull();
                entityName.exception.ShouldBeNull();
                entityName.ID().Symbol.Text.ShouldEqual(_entity_name);
            }

            [Test]
            public void Should_parse_documentation()
            {
                var documentation = _testRuleContext.documentation();
                documentation.ShouldNotBeNull();
                documentation.exception.ShouldBeNull();

                var documentationLine = documentation.documentationLine();
                documentationLine.Length.ShouldEqual(1);
                documentationLine[0].exception.ShouldBeNull();
            }

            [Test]
            public void Should_parse_properties_collection_with_exception()
            {
                var properties = _testRuleContext.property();
                properties.ShouldNotBeNull();
                properties.Length.ShouldEqual(1);
                properties[0].exception.ShouldNotBeNull();
            }
        }

        [TestFixture]
        public class When_parsing_abstract_entity_with_no_documentation : BaseParserTest
        {
            private const string _entity_name = "MyIdentifier";
            private const string _property_name = "Property1";
            private const string _property_documentation = "property documentation";
            private AbstractEntity.AbstractEntityContext _testRuleContext;
            private string _formattedStringTree;

            protected override MetaEdTextBuilder BuildMetaEdText()
            {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder
                                  .WithStartAbstractEntity(_entity_name)
                                  .WithStringProperty(_property_name, _property_documentation, true, false, 100)
                                  .WithEndAbstractEntity()
                                  ;
                return metaEdTextBuilder;
            }

            protected override ITokenSource BuildLexer(ICharStream input)
            {
                return new BaseLexer(input);
            }

            protected override ParserRuleContext RunParser(ITokenStream tokenStream)
            {
                var parser = new AbstractEntity(tokenStream);
                _testRuleContext = parser.abstractEntity();
                _formattedStringTree = _testRuleContext.ToStringWithRuleAndTokenNames(parser);
                return _testRuleContext;
            }

            [Test]
            public void Should_not_successfully_parse()
            {
                _context.ShouldNotBeNull();
                Console.WriteLine(_formattedStringTree);
                _context.HasErrors().ShouldBeTrue();
            }

            [Test]
            public void Should_parse_abstract_entity()
            {
                var abstractEntity = _testRuleContext;
                abstractEntity.ShouldNotBeNull();
                abstractEntity.exception.ShouldBeNull();
            }

            [Test]
            public void Should_parse_entity_name()
            {
                var entityName = _testRuleContext.abstractEntityName();
                entityName.ShouldNotBeNull();
                entityName.exception.ShouldBeNull();
                entityName.ID().Symbol.Text.ShouldEqual(_entity_name);
            }

            [Test]
            public void Should_parse_properties_collection()
            {
                var properties = _testRuleContext.property();
                properties.ShouldNotBeNull();
                properties.Length.ShouldEqual(1);
                properties[0].exception.ShouldBeNull();
            }

            [Test]
            public void Should_parse_documentation_with_exception()
            {
                var documentation = _testRuleContext.documentation();
                documentation.ShouldNotBeNull();
                documentation.exception.ShouldNotBeNull();

                var documentationLine = documentation.documentationLine();
                documentationLine.Length.ShouldEqual(0);
            }
        }

        [TestFixture]
        public class When_parsing_abstract_entity_with_no_name : BaseParserTest
        {
            private const string _documentation = "bad sample documentation";
            private const string _property_name = "Property1";
            private const string _property_documentation = "property documentation";

            private AbstractEntity.AbstractEntityContext _testRuleContext;
            private string _formattedStringTree;

            protected override MetaEdTextBuilder BuildMetaEdText()
            {
                var metaEdTextBuilder = new MetaEdTextBuilder();
                metaEdTextBuilder
                                  .WithStartAbstractEntity(null)
                                  .WithDocumentation(_documentation)
                                  .WithStringProperty(_property_name, _property_documentation, true, false, 100)
                                  .WithEndAbstractEntity()
                                  ;
                return metaEdTextBuilder;
            }

            protected override ITokenSource BuildLexer(ICharStream input)
            {
                return new BaseLexer(input);
            }

            protected override ParserRuleContext RunParser(ITokenStream tokenStream)
            {
                var parser = new AbstractEntity(tokenStream);
                _testRuleContext = parser.abstractEntity();
                _formattedStringTree = _testRuleContext.ToStringWithRuleAndTokenNames(parser);
                return _testRuleContext;
            }

            [Test]
            public void Should_not_successfully_parse()
            {
                _context.ShouldNotBeNull();
                Console.WriteLine(_formattedStringTree);
                _context.HasErrors().ShouldBeTrue();
            }

            [Test]
            public void Should_parse_abstract_entity()
            {
                var abstractEntity = _testRuleContext;
                abstractEntity.ShouldNotBeNull();
                abstractEntity.exception.ShouldBeNull();
            }

            [Test]
            public void Should_unsuccesfully_parse_entity_name()
            {
                var entityName = _testRuleContext.abstractEntityName();
                entityName.ShouldNotBeNull();
                entityName.exception.ShouldBeNull();
                entityName.ID().Symbol.Text.ShouldEqual("<missing ID>");
            }
        }
    }
}
*/