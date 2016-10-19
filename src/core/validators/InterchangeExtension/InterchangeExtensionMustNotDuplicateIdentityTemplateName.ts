import { ValidationRuleBase } from "../ValidationRuleBase";
import {ISymbolTable} from '../SymbolTable'
export class InterchangeExtensionMustNotDuplicateIdentityTemplateName extends ValidationRuleBase<MetaEdGrammar.InterchangeExtensionContext>
{
    private symbolTable: ISymbolTable;
    constructor(symbolTable: ISymbolTable) {
        super();
        this.symbolTable = symbolTable;
    }
    private static duplicateIdentityTemplates(context: MetaEdGrammar.InterchangeExtensionContext): string[] {
        let identityTemplates = context.interchangeExtensionComponent().interchangeIdentityTemplate().Select(x => x.ID().GetText());
        return identityTemplates.GroupBy(x => x).Where(group => group.Count() > 1).Select(group => group.Key).ToArray();
    }
    public isValid(context: MetaEdGrammar.InterchangeExtensionContext): boolean {
        return InterchangeExtensionMustNotDuplicateIdentityTemplateName.duplicateIdentityTemplates(context).length == 0;
    }
    public getFailureMessage(context: MetaEdGrammar.InterchangeExtensionContext): string {
        let identifier = context.extendeeName().GetText();
        let duplicateIdentityTemplates = InterchangeExtensionMustNotDuplicateIdentityTemplateName.duplicateIdentityTemplates(context);
        return `Interchange additions '${identifier}' declares duplicate identity template${duplicateIdentityTemplates.length > 1 ? "s" : ""} '${duplicateIdentityTemplates.join(', ')}'`;
    }
}
