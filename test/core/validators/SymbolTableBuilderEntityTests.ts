/// <reference path="../../../typings/index.d.ts" />
import chai = require('chai');
import MetaEdTextBuilder from "../../grammar/MetaEdTextBuilder";
import {ValidationTestHelper} from "./ValidationTestHelper";

let should = chai.should();

describe('SymbolTableBuilderEntityTests', () => {
    describe('When_loading_domain_entity', () => {
        const symbolTableKey : string = "Domain Entity";
        const entityName : string = "EntityName";
        const propertyName : string = "PropertyName";

        let helper: ValidationTestHelper;

        before( () => {
            const metaEdTextBuilder: MetaEdTextBuilder = new MetaEdTextBuilder();
            const metaEdText: string = metaEdTextBuilder
                .withBeginNamespace("edfi")
                .withStartDomainEntity(entityName)
                .withMetaEdId("100")
                .withDocumentation("doc")
                .withBooleanProperty(propertyName, "doc", true, false)
                .withEndDomainEntity()
                .withEndNamespace()
                .toString();

            helper = new ValidationTestHelper();
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

