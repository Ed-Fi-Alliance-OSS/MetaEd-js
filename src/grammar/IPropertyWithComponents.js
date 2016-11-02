// @flow
import { IContextWithIdentifier } from './IContextWithIdentifier';

declare type PropertyComponentsContext = any;

export interface IPropertyWithComponents extends IContextWithIdentifier {
    propertyComponents(): PropertyComponentsContext;
    propertyIdentifier(): string;
    propertyName(): string;
}
