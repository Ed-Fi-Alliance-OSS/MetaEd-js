import MetaEdTextBuilder from '../MetaEdTextBuilder';
import ParserTestHelper from "./ParserTestHelper";

import chai from 'chai'
chai.should();

describe('AbstractEntityTests', () => {
    describe('When_parsing_abstract_entity_with_name_documentation_and_property', () => {

        const entity_name: string = "MyIdentifier";
        const documentation1: string  = "line 1 of documentation";
        const documentation2: string = "another line of intervention documentation";
        const property_name: string = "Property1";
        const property_documentation: string = "property intervention documentation";

        const metaEdTextBuilder: MetaEdTextBuilder = new MetaEdTextBuilder();
        const inputText: string = metaEdTextBuilder
            .withStartAbstractEntity(entity_name)
            .withMetaEdId("100")
            .withDocumentation(documentation1,documentation2)
            .withStringProperty(property_name, property_documentation, true, false, 100)
            .withEndAbstractEntity()
            .toString();

        let context;

        before( () => {
            const parser = ParserTestHelper.parse(inputText);
            context = parser.abstractEntity();
        });

        it('Should_successfully_parse', () => {
            should.exist(context);
            should.not.exist(context.exception);
            ParserTestHelper.hasErrors(context).should.be.false;
        });

        it('Should_parse_entity_name', () => {
            let entityName = context.abstractEntityName();
            entityName.should.exist;
            should.not.exist(entityName.exception);
            entityName.ID().symbol.text.should.equal(entity_name);
        });

        it('Should_parse_documentation', () => {
            let documentation = context.documentation();
            documentation.should.exist;
            should.not.exist(documentation.exception);

            let documentationLine = documentation.documentationLine();
            documentationLine.length.should.equal(2);
            should.exist(documentationLine[0]);
            should.exist(documentationLine[1]);
        });

        it('Should_parse_properties_collection', () => {
            let properties = context.property();
            properties.should.exist;
            properties.length.should.equal(1);
            should.not.exist(properties[0].exception);
        });

        it('Should_parse_metaedId', () => {
            context.should.exist;
            context.metaEdId().should.exist;
            context.metaEdId().METAED_ID().getText().should.equal("[100]");
        });
    });
});
