"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
const SymbolTableEntityType_1 = require('../SymbolTableEntityType');
class DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity extends ValidationRuleBase_1.ValidationRuleBase {
    constructor(symbolTable) {
        super();
        this.symbolTableEntityType = new SymbolTableEntityType_1.default();
        this.symbolTable = symbolTable;
    }
    isValid(context) {
        let anyIdentityRenames = context.property().Any(x => x.GetProperty().propertyComponents().propertyAnnotation().identityRename() != null);
        if (!anyIdentityRenames)
            return true;
        let baseIdentifier = context.baseName().GetText();
        let baseSymbolTable = this.symbolTable.get(this.symbolTableEntityType.domainEntityEntityType(), baseIdentifier);
        if (baseSymbolTable == null)
            return true;
        return baseSymbolTable.propertySymbolTable.values().Count(v => v.propertyComponents().propertyAnnotation().identity() != null) <= 1;
    }
    getFailureMessage(context) {
        let identifier = context.entityName().GetText();
        let baseIdentifier = context.baseName().GetText();
        return `Domain Entity '${identifier}' based on '${baseIdentifier}' is invalid for identity rename because parent entity '${baseIdentifier}' has more than one identity property.`;
    }
}
exports.DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity = DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity;
//# sourceMappingURL=DomainEntitySubclassIdentityRenameMustNotExistForMultiPropertyIdentity.js.map