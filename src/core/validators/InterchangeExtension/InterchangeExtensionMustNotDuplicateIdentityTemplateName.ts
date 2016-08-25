import { ValidationRuleBase } from "../ValidationRuleBase";
export class InterchangeExtensionMustNotDuplicateIdentityTemplateName extends ValidationRuleBase<MetaEdGrammar.InterchangeExtensionContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    private static duplicateIdentityTemplates(context: MetaEdGrammar.InterchangeExtensionContext): string[] {
        var identityTemplates = context.interchangeExtensionComponent().interchangeIdentityTemplate().Select(x => x.ID().GetText());
        return identityTemplates.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
    }
    public isValid(context: MetaEdGrammar.InterchangeExtensionContext): boolean {
        return InterchangeExtensionMustNotDuplicateIdentityTemplateName.duplicateIdentityTemplates(context).length == 0;
    }
    public getFailureMessage(context: MetaEdGrammar.InterchangeExtensionContext): string {
        var identifier = context.extendeeName().GetText();
        var duplicateIdentityTemplates = InterchangeExtensionMustNotDuplicateIdentityTemplateName.duplicateIdentityTemplates(context);
        return `Interchange additions '${identifier}' declares duplicate identity template${duplicateIdentityTemplates.length > 1 ? "s" : ""} '${duplicateIdentityTemplates.join(', ')}'`;
    }
}
