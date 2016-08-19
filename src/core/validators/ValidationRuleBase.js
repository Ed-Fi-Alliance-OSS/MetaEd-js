"use strict";
const ValidationLevel_1 = require("./ValidationLevel");
class ValidationRuleBase {
    level() {
        return ValidationLevel_1.ValidationLevel.Error;
    }
    getProperty(propertyContext) {
        if (propertyContext.booleanProperty())
            return propertyContext.booleanProperty();
        if (propertyContext.currencyProperty())
            return propertyContext.currencyProperty();
        if (propertyContext.dateProperty())
            return propertyContext.dateProperty();
        if (propertyContext.decimalProperty())
            return propertyContext.decimalProperty();
        if (propertyContext.descriptorProperty())
            return propertyContext.descriptorProperty();
        if (propertyContext.durationProperty())
            return propertyContext.durationProperty();
        if (propertyContext.enumerationProperty())
            return propertyContext.enumerationProperty();
        if (propertyContext.includeProperty())
            return propertyContext.includeProperty();
        if (propertyContext.integerProperty())
            return propertyContext.integerProperty();
        if (propertyContext.percentProperty())
            return propertyContext.percentProperty();
        if (propertyContext.referenceProperty())
            return propertyContext.referenceProperty();
        if (propertyContext.sharedDecimalProperty())
            return propertyContext.sharedDecimalProperty();
        if (propertyContext.sharedIntegerProperty())
            return propertyContext.sharedIntegerProperty();
        if (propertyContext.sharedShortProperty())
            return propertyContext.sharedShortProperty();
        if (propertyContext.sharedStringProperty())
            return propertyContext.sharedStringProperty();
        if (propertyContext.shortProperty())
            return propertyContext.shortProperty();
        if (propertyContext.stringProperty())
            return propertyContext.stringProperty();
        if (propertyContext.timeProperty())
            return propertyContext.timeProperty();
        if (propertyContext.yearProperty())
            return propertyContext.yearProperty();
        return null;
    }
}
exports.ValidationRuleBase = ValidationRuleBase;
//# sourceMappingURL=ValidationRuleBase.js.map