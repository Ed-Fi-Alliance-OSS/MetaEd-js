import { ValidationRuleBase } from "../ValidationRuleBase";
export class InterchangeMustNotDuplicateIdentityTemplateName extends ValidationRuleBase<MetaEdGrammar.InterchangeContext>
{
    private _symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        this._symbolTable = symbolTable;
    }
    private static duplicateIdentityTemplates(context: MetaEdGrammar.InterchangeContext): string[] {
        let identityTemplates = context.interchangeComponent().interchangeIdentityTemplate().Select(x => x.ID().GetText());
        return identityTemplates.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
    }
    public isValid(context: MetaEdGrammar.InterchangeContext): boolean {
        return InterchangeMustNotDuplicateIdentityTemplateName.duplicateIdentityTemplates(context).length == 0;
    }
    public getFailureMessage(context: MetaEdGrammar.InterchangeContext): string {
        let identifier = context.interchangeName().GetText();
        let duplicateIdentityTemplates = InterchangeMustNotDuplicateIdentityTemplateName.duplicateIdentityTemplates(context);
        return `Interchange '${identifier}' declares duplicate identity template${duplicateIdentityTemplates.length > 1 ? "s" : ""} '${duplicateIdentityTemplates.join(', ')}'.`; 
    }
}
