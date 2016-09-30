// @flow
import R from 'ramda';

import ValidationLevel from '../ValidationLevel';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';
import validationRuleBase from '../ValidationRuleBase';
import SymbolTable from '../SymbolTable';
import { getAncestorContext, isExtensionNamespace, namespaceNameFor } from "../ValidationHelper";

const level = ValidationLevel.Error;

function handled(ruleContext: any) : boolean {
    return ruleContext.ruleIndex === MetaEdGrammar.RULE_associationExtension;
}

function valid(ruleContext: any, symbolTable: SymbolTable) : boolean {
    const parentNamespaceContext = getAncestorContext(ruleContext, MetaEdGrammar.RULE_namespace);
    return isExtensionNamespace(parentNamespaceContext);
}

function failureMessage(ruleContext: any, symbolTable: SymbolTable) : string {
    const parentNamespaceContext = getAncestorContext(ruleContext, MetaEdGrammar.RULE_namespace);
    return `Association additions '${ruleContext.extendeeName().getText()}' is not valid in core namespace '${namespaceNameFor(parentNamespaceContext)}`;
}

const validationRule = R.partial(validationRuleBase, [level, handled, valid, failureMessage]);
export { validationRule as default };
