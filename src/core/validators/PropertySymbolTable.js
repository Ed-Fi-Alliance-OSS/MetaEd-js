// @flow
import { propertyNameStringHandlingSharedProperty } from './ValidationHelper';

declare type PropertyRuleContext = any;

export default class PropertySymbolTable {
  _symbolTable: Map<string, PropertyRuleContext>;
  _parentName: string;

  constructor(parentName: string) {
    this._parentName = parentName;
    this._symbolTable = new Map();
  }

  parentName(): string {
    return this._parentName;
  }

  // name should be prefixed by a 'with context' value if one exists for property
  tryAdd(name: string, propertyRuleContext: PropertyRuleContext): boolean {
    if (this._symbolTable.has(name)) return false;
    this._symbolTable.set(name, propertyRuleContext);
    return true;
  }

  // name should be prefixed by a 'with context' value if one exists for property
  get(name: string): ?PropertyRuleContext {
    return this._symbolTable.get(name);
  }

  // results are prefixed by a 'with context' value if one exists for property
  identifiers(): Iterator<string> {
    return this._symbolTable.keys();
  }

  values(): Iterator<PropertyRuleContext> {
    return this._symbolTable.values();
  }

  // candidate identifiers should be prefixed by a 'with context' value if one exists for property
  contextsForMatchingIdentifiers(candidateIdentifiers: Array<string>): Array<PropertyRuleContext> {
    return Array.from(this._symbolTable.entries()).filter(x => candidateIdentifiers.some(e => e === x[0])).map(y => y[1]);
  }

  getWithoutContext(name: string): Array<PropertyRuleContext> {
    return Array.from(this._symbolTable.entries()).filter(x => propertyNameStringHandlingSharedProperty(x[1]) === name).map(x => x[1]);
  }
}
