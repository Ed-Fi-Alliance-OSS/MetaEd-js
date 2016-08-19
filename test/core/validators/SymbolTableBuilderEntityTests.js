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
        // [TestFixture]
        // public class When_loading_duplicate_domain_entity : BaseSymbolTableBuilderTest
        // {
        // protected override string MetaEdText()
        //     {
        //         var metaEdTextBuilder = new MetaEdTextBuilder();
        //         metaEdTextBuilder.WithBeginNamespace("edfi")
        //             .WithStartDomainEntity(_entity_name)
        //             .WithDocumentation("because documentation is required")
        //             .WithBooleanProperty(_property_name, "because a property is required", true, false)
        //             .WithEndDomainEntity();
        //
        //         metaEdTextBuilder.WithStartDomainEntity(_entity_name)
        //             .WithDocumentation("because documentation is required")
        //             .WithBooleanProperty(_property_name, "because a property is required", true, false)
        //             .WithEndDomainEntity()
        //             .WithEndNamespace();
        //
        //         return metaEdTextBuilder;
        //     }
        //
        //     [Test]
        // public void Should_report_the_duplicate()
        //     {
        //         _errorMessageCollection.Count.ShouldEqual(1);
        //         var failure = _errorMessageCollection[0];
        //         failure.Message.ShouldContain(_entity_name);
        //         failure.Message.ShouldContain("Duplicate");
        //     }
        //
        //     [Test]
        // public void Should_report_position_of_error()
        //     {
        //         _errorMessageCollection.Count.ShouldEqual(1);
        //         var failure = _errorMessageCollection[0];
        //         failure.ConcatenatedLineNumber.ShouldEqual(9);
        //         failure.CharacterPosition.ShouldEqual(16);
        //     }
        // }
    });
});
//# sourceMappingURL=SymbolTableBuilderEntityTests.js.map