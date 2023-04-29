import { DbType } from './DbType';

export interface ApiPropertyType {
  dbType: DbType;
  minLength?: number;
  maxLength?: number;
  precision?: number;
  scale?: number;
  isNullable: boolean;
  minValue?: number;
  maxValue?: number;
}
