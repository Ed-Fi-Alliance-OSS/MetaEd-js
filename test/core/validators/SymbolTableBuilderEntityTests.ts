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

