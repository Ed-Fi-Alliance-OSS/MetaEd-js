import { ValidationRuleBase } from "../ValidationRuleBase";
export class DomainEntitySubclassIdentityRenameMustExistNoMoreThanOnce extends ValidationRuleBase<MetaEdGrammar.DomainEntitySubclassContext>
{
    public isValid(context: MetaEdGrammar.DomainEntitySubclassContext): boolean {
        let identityRenameCount = context.property().Count(x => x.GetProperty().propertyComponents().propertyAnnotation().identityRename() != null);
        return identityRenameCount <= 1;
    }
    public getFailureMessage(context: MetaEdGrammar.DomainEntitySubclassContext): string {
        let identifier = context.entityName().GetText();
        let baseIdentifier = context.baseName().GetText();
        let identityRenames = context.property().Select(y => y.GetProperty().propertyComponents().propertyAnnotation().identityRename()).Where(x => x != null);
        let basePropertyIdentifier = string.Join(", ", identityRenames.Select(pkr => pkr.baseKeyName().GetText()));
        return `Domain Entity '${identifier}' based on '${baseIdentifier}' tries to rename columns ${basePropertyIdentifier}.  Only one identity rename is allowed for a given Domain Entity.`;
    }
}
