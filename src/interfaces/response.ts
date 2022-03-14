import { IMetaData } from './meta-data';

export interface Response {
  'metaData': IMetaData;
  data?: any;
}
