import chai from 'chai';
import MetaEdTextBuilder from '../MetaEdTextBuilder';
import ParserTestHelper from './ParserTestHelper';

const should = chai.should();

describe('AbstractEntityTests', () => {
  describe('When_parsing_abstract_entity_with_name_documentation_and_property', () => {
    const entityName: string = 'MyIdentifier';
    const documentation1: string = 'line 1 of documentation';
    const documentation2: string = 'another line of intervention documentation';
    const propertyName: string = 'Property1';
    const propertyDocumentation: string = 'property intervention documentation';

    const metaEdTextBuilder: MetaEdTextBuilder = new MetaEdTextBuilder();
    const inputText: string = metaEdTextBuilder
    .withStartAbstractEntity(entityName)
    .withMetaEdId('100')
    .withDocumentation(documentation1, documentation2)
    .withStringProperty(propertyName, propertyDocumentation, true, false, 100)
    .withEndAbstractEntity()
    .toString();

    let context;

    before(() => {
      const parser = ParserTestHelper.parse(inputText);
      context = parser.abstractEntity();
    });

    it('Should_successfully_parse', () => {
      should.exist(context);
      should.not.exist(context.exception);
      ParserTestHelper.hasErrors(context).should.be.false;
    });

    it('Should_parse_entity_name', () => {
      const abstractEntityName = context.abstractEntityName();
      abstractEntityName.should.exist;
      should.not.exist(abstractEntityName.exception);
      abstractEntityName.ID().symbol.text.should.equal(entityName);
    });

    it('Should_parse_documentation', () => {
      const documentation = context.documentation();
      documentation.should.exist;
      should.not.exist(documentation.exception);

      const documentationLine = documentation.documentationLine();
      documentationLine.length.should.equal(2);
      should.exist(documentationLine[0]);
      should.exist(documentationLine[1]);
    });

    it('Should_parse_properties_collection', () => {
      const properties = context.property();
      properties.should.exist;
      properties.length.should.equal(1);
      should.not.exist(properties[0].exception);
    });

    it('Should_parse_metaedId', () => {
      context.should.exist;
      context.metaEdId().should.exist;
      context.metaEdId().METAED_ID().getText().should.equal('[100]');
    });
  });
});
