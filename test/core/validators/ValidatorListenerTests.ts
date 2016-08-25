/// <reference path="../../../../typings/index.d.ts" />
import chai = require('chai');
import {ValidationTestHelper} from "./ValidationTestHelper";
import {ValidatorListener} from "../../../src/core/validators/ValidatorListener";
import {TestRuleProvider} from "./TestRuleProvider";
import NullSymbolTableBuilderListener from "../../common/NullSymbolTableBuilderListener"

let should = chai.should();

//TODO: this needs to be revisited.

describe('ValidatorListenerTests', () => {
    let validatorListener = new NullSymbolTableBuilderListener();

    describe('When_validating_meta_ed_grammar', () => {
        let helper: ValidationTestHelper = new ValidationTestHelper();
        before(() => {
            let metaEdText: string = "Begin Namespace edfi core \n Domain Entity Test1 \n     documentation 'some documentation \n     string Property1 \n         documentation 'Property documentation starts here \n         is part of identity \n         max length 50 \n Domain Entity Test2 \n     documentation 'duck documentation \n       integer Property1 \n         documentation 'Property documentation starts here \n         is part of identity \n Domain Entity Test3 \n     documentation 'elephant documentation \n   date Property1 \n         documentation 'Property documentation starts here \n         is part of identity \n Domain Entity Test4 \n     documentation 'raccoon documentation \n     'raccoon documentation \n     'raccoon documentation \n     bool Property1 \n         documentation 'Property documentation starts here \n         is part of identity \n End Namespace \n";

            helper.setup(metaEdText, validatorListener);
        });
        it('should_fail_for_each_domain_entity', () => {
            helper.errorMessageCollection.count.ShouldEqual(4);
        });
        it('should_set_line_numbers_for_each_validation', () => {
            helper.errorMessageCollection[0].ConcatenatedLineNumber.ShouldEqual(4);
            helper.errorMessageCollection[1].ConcatenatedLineNumber.ShouldEqual(10);
            helper.errorMessageCollection[2].ConcatenatedLineNumber.ShouldEqual(15);
            helper.errorMessageCollection[3].ConcatenatedLineNumber.ShouldEqual(22);
        });
        it('should_set_character_position_for_each_validation', () => {
            helper.errorMessageCollection[0].CharacterPosition.ShouldEqual(4);
            helper.errorMessageCollection[1].CharacterPosition.ShouldEqual(6);
            helper.errorMessageCollection[2].CharacterPosition.ShouldEqual(2);
            helper.errorMessageCollection[3].CharacterPosition.ShouldEqual(4);
        });
    });
});