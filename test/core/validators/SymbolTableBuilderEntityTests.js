"use strict";
/// <reference path="../../../typings/index.d.ts" />
const chai = require('chai');
const MetaEdTextBuilder_1 = require("../../grammar/MetaEdTextBuilder");
const ValidationTestBase_1 = require("./ValidationTestBase");
let should = chai.should();
describe('SymbolTableBuilderEntityTests', () => {
    describe('When_loading_domain_entity', () => {
        const symbolTableKey = "Domain Entity";
        const entityName = "EntityName";
        const propertyName = "PropertyName";
        let validationTestBase;
        before(() => {
            const metaEdTextBuilder = new MetaEdTextBuilder_1.default();
            const metaEdText = metaEdTextBuilder
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withMetaEdId("100")
                .withDocumentation("doc")
                .withBooleanProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace()
                .toString();
            validationTestBase = new ValidationTestBase_1.ValidationTestBase();
            validationTestBase.setup(metaEdText);
        });
        it('Should_load_into_symbol_table', () => {
            const entityContext = validationTestBase.symbolTable.get(symbolTableKey, entityName);
            entityContext.should.not.be.empty;
            entityContext.name.should.equal(entityName);
            entityContext.context.should.not.be.empty;
        });
    });
});
//# sourceMappingURL=SymbolTableBuilderEntityTests.js.map