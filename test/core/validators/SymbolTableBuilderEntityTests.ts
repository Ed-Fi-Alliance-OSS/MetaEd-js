/// <reference path="../../../typings/index.d.ts" />
import chai = require('chai');
import MetaEdTextBuilder from "../../grammar/MetaEdTextBuilder";
import {ValidationTestBase} from "./ValidationTestBase";

let should = chai.should();

describe('SymbolTableBuilderEntityTests', () => {
    describe('When_loading_domain_entity', () => {
        const symbolTableKey : string = "Domain Entity";
        const entityName : string = "EntityName";
        const propertyName : string = "PropertyName";

        let validationTestBase: ValidationTestBase;

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

            validationTestBase = new ValidationTestBase();
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

