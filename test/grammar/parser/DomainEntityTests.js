/// <reference path="../../../typings/index.d.ts" />
"use strict";
const MetaEdTextBuilder_1 = require('../MetaEdTextBuilder');
const ParserTestHelper_1 = require("./ParserTestHelper");
const chai = require('chai');
let should = chai.should();
describe('DomainEntityTests', () => {
    describe('When_parsing_domain_entity_with_name_documentation_and_property', () => {
        const entity_name = "MyIdentifier";
        const documentation1 = "line 1 of documentation";
        const documentation2 = "another line of intervention documentation";
        const property_name = "Property1";
        const property_documentation = "property intervention documentation";
        const metaEdTextBuilder = new MetaEdTextBuilder_1.default();
        const inputText = metaEdTextBuilder
            .withStartDomainEntity(entity_name)
            .withMetaEdId("100")
            .withDocumentation(documentation1, documentation2)
            .withStringProperty(property_name, property_documentation, true, false, 100)
            .withEndDomainEntity()
            .toString();
        let context;
        before(() => {
            const parser = ParserTestHelper_1.default.parse(inputText);
            context = parser.domainEntity();
            //console.log(MetaEdGrammarHelper.toStringTree(context, parser));
        });
        it('Should_successfully_parse', () => {
            should.exist(context);
            should.not.exist(context.exception);
            ParserTestHelper_1.default.hasErrors(context).should.be.false;
        });
        it('Should_parse_entity_name', () => {
            let entityName = context.entityName();
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
//# sourceMappingURL=DomainEntityTests.js.map