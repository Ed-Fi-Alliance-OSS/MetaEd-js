import { ValidationRuleBase } from "../ValidationRuleBase";
import ValidationHelper from "../../../common/ValidationHelper";
let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;

export class AssociationExtensionExistsOnlyInExtensionNamespace extends ValidationRuleBase
{
    public handlesContext(context: any) : boolean {
        return context.ruleIndex === MetaEdGrammar.RULE_associationExtension;
    }

    public isValid(context: any): boolean {
        let parentNamespaceContext = ValidationHelper.getAncestorContext(context, MetaEdGrammar.RULE_namespace);
        return ValidationHelper.isExtensionNamespace(parentNamespaceContext);
    }

    public getFailureMessage(context: any): string {
        let parentNamespaceContext = ValidationHelper.getAncestorContext(context, MetaEdGrammar.RULE_namespace);
        return `Association additions '${context.extendeeName().getText()}' is not valid in core namespace '${ValidationHelper.namespaceNameFor(parentNamespaceContext)}`;
    }
}
