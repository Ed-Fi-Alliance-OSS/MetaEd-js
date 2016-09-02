"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
const ValidationHelper_1 = require("../../../common/ValidationHelper");
let MetaEdGrammar = require("../../../../src/grammar/gen/MetaEdGrammar").MetaEdGrammar;
class AssociationExtensionExistsOnlyInExtensionNamespace extends ValidationRuleBase_1.ValidationRuleBase {
    handlesContext(context) {
        return context.ruleIndex === MetaEdGrammar.RULE_associationExtension;
    }
    isValid(context) {
        let parentNamespaceContext = ValidationHelper_1.default.getAncestorContext(context, MetaEdGrammar.RULE_namespace);
        return ValidationHelper_1.default.isExtensionNamespace(parentNamespaceContext);
    }
    getFailureMessage(context) {
        let parentNamespaceContext = ValidationHelper_1.default.getAncestorContext(context, MetaEdGrammar.RULE_namespace);
        return `Association additions '${context.extendeeName().getText()}' is not valid in core namespace '${ValidationHelper_1.default.namespaceNameFor(parentNamespaceContext)}`;
    }
}
exports.AssociationExtensionExistsOnlyInExtensionNamespace = AssociationExtensionExistsOnlyInExtensionNamespace;
//# sourceMappingURL=AssociationExtensionExistsOnlyInExtensionNamespace.js.map