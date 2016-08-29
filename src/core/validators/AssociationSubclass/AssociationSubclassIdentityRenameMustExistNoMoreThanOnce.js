"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class AssociationSubclassIdentityRenameMustExistNoMoreThanOnce extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        let identityRenameCount = context.property().Count(x => x.GetProperty().propertyComponents().propertyAnnotation().identityRename() != null);
        return identityRenameCount <= 1;
    }
    getFailureMessage(context) {
        let identifier = context.associationName().GetText();
        let baseIdentifier = context.baseName().GetText();
        let identityRenames = context.property().Select(y => y.GetProperty().propertyComponents().propertyAnnotation().identityRename()).Where(x => x != null);
        let basePropertyIdentifier = identityRenames.Select(pkr => pkr.baseKeyName().GetText()).join(', ');
        return `Association '${identifier}' based on '${baseIdentifier}' tries to rename columns ${basePropertyIdentifier}.  Only one identity rename is allowed for a given Association.`;
    }
}
exports.AssociationSubclassIdentityRenameMustExistNoMoreThanOnce = AssociationSubclassIdentityRenameMustExistNoMoreThanOnce;
//# sourceMappingURL=AssociationSubclassIdentityRenameMustExistNoMoreThanOnce.js.map