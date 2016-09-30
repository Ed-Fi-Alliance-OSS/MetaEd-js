import { ValidationRuleBase } from "../ValidationRuleBase";
export class AssociationSubclassIdentityRenameMustExistNoMoreThanOnce extends ValidationRuleBase<MetaEdGrammar.AssociationSubclassContext>
{
    public isValid(context: MetaEdGrammar.AssociationSubclassContext): boolean {
        let identityRenameCount = context.property().Count(x => x.GetProperty().propertyComponents().propertyAnnotation().identityRename() != null);
        return identityRenameCount <= 1;
    }
    public getFailureMessage(context: MetaEdGrammar.AssociationSubclassContext): string {
        let identifier = context.associationName().GetText();
        let baseIdentifier = context.baseName().GetText();
        let identityRenames = context.property().Select(y => y.GetProperty().propertyComponents().propertyAnnotation().identityRename()).Where(x => x != null);
        let basePropertyIdentifier = identityRenames.Select(pkr => pkr.baseKeyName().GetText()).join(', ');
        return `Association '${identifier}' based on '${baseIdentifier}' tries to rename columns ${basePropertyIdentifier}.  Only one identity rename is allowed for a given Association.`;
    }
}
