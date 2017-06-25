// @flow
import type { ValidationFailure } from './ValidationFailure';
import type { Repository } from '../model/Repository';
import type { PropertyIndex } from '../model/property/PropertyIndex';

export type Validator = (Repository, PropertyIndex) => Array<ValidationFailure>;
