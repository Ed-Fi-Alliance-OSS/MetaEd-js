import { ValidationRuleBase } from "../ValidationRuleBase";
export class DomainEntitySubclassIdentityRenameMustExistNoMoreThanOnce extends ValidationRuleBase<MetaEdGrammar.DomainEntitySubclassContext>
{
    public isValid(context: MetaEdGrammar.DomainEntitySubclassContext): boolean {
        let identityRenameCount = context.property().Count(x => getProperty(x).propertyComponents().propertyAnnotation().identityRename() != null);
        return identityRenameCount <= 1;
    }
    public getFailureMessage(context: MetaEdGrammar.DomainEntitySubclassContext): string {
        let identifier = context.entityName().getText();
        let baseIdentifier = context.baseName().getText();
        let identityRenames = context.property().map(y => getProperty(y).propertyComponents().propertyAnnotation().identityRename()).filter(x => x != null);
        let basePropertyIdentifier = string.Join(", ", identityRenames.map(pkr => pkr.baseKeyName().getText()));
        return `Domain Entity '${identifier}' based on '${baseIdentifier}' tries to rename columns ${basePropertyIdentifier}.  Only one identity rename is allowed for a given Domain Entity.`;
    }
}
