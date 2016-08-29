"use strict";
const ValidationRuleBase_1 = require("../ValidationRuleBase");
class DomainEntityMustContainNoMoreThanOneUniqueIdColumn extends ValidationRuleBase_1.ValidationRuleBase {
    isValid(context) {
        let namespaceInfo = context.GetAncestorContext();
        return namespaceInfo.IsExtension || context.property().Count(x => x.GetProperty().PropertyName() == "UniqueId") <= 1;
    }
    getFailureMessage(context) {
        return `Domain Entity ${context.entityName().ID().GetText()} has multiple properties with a property name of 'UniqueId'.  Only one column in a core domain entity can be named 'UniqueId'.`;
    }
}
exports.DomainEntityMustContainNoMoreThanOneUniqueIdColumn = DomainEntityMustContainNoMoreThanOneUniqueIdColumn;
//# sourceMappingURL=DomainEntityMustContainNoMoreThanOneUniqueIdColumn.js.map