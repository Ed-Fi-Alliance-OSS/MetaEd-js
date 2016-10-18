// @flow
import { associationExtensionErrorRule, includeAssociationExtensionRule } from './AssociationExtensionValidationRule';
import { MetaEdGrammar } from '../../../../src/grammar/gen/MetaEdGrammar';
import SymbolTable from '../SymbolTable';
import { getAncestorContext, isExtensionNamespace, namespaceNameFor } from "../ValidationHelper";

function valid(ruleContext: any, symbolTable: SymbolTable) : boolean {
    const parentNamespaceContext = getAncestorContext(ruleContext, MetaEdGrammar.RULE_namespace);
    return isExtensionNamespace(parentNamespaceContext);
}

function failureMessage(ruleContext: any, symbolTable: SymbolTable) : string {
    const parentNamespaceContext = getAncestorContext(ruleContext, MetaEdGrammar.RULE_namespace);
    return `Association additions '${ruleContext.extendeeName().getText()}' is not valid in core namespace '${namespaceNameFor(parentNamespaceContext)}`;
}

const validationRule = associationExtensionErrorRule(valid, failureMessage);
export { validationRule as default };

export const includeRule = includeAssociationExtensionRule(validationRule);
