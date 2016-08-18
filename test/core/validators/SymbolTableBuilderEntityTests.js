"use strict";
/// <reference path="../../../typings/index.d.ts" />
const chai = require('chai');
const MetaEdTextBuilder_1 = require("../../grammar/MetaEdTextBuilder");
const ValidationTestHelper_1 = require("./ValidationTestHelper");
let should = chai.should();
describe('SymbolTableBuilderEntityTests', () => {
    describe('When_loading_domain_entity', () => {
        const symbolTableKey = "Domain Entity";
        const entityName = "EntityName";
        const propertyName = "PropertyName";
        let helper;
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
            helper = new ValidationTestHelper_1.ValidationTestHelper();
            helper.setup(metaEdText);
        });
        it('Should_load_into_symbol_table', () => {
            const entityContext = helper.symbolTable.get(symbolTableKey, entityName);
            entityContext.should.not.be.empty;
            entityContext.name.should.equal(entityName);
            entityContext.context.should.not.be.empty;
        });
    });
});
//# sourceMappingURL=SymbolTableBuilderEntityTests.js.map