import { ILevelModel } from '../models/interfaces/level-model';
import { LevelModel } from '../models/classes/model';
import * as UserSymbolsService from './user-symbols';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '../constants/common-constants';
import * as _ from 'lodash';

const levelModel = new LevelModel();


export const getLevels = async() =>{

  const level = await levelModel.getLevel();

  return level;
}

export const getSignalById = async (levelId: number): Promise<ILevelModel | undefined> => {
  const levels: ILevelModel[] = await levelModel.getLevel({id: levelId});
  return _.head(levels);
};

export const createLevel = (body: ILevelModel) => {
  return levelModel.storeLevel(body);
};

export const getAllRecentUserLevels = async (userId: number, offset: number, limit: number): Promise<ILevelModel[]> => {
  const userSymbols = await UserSymbolsService
    .getUserSymbolsByUserId(userId, DEFAULT_OFFSET, DEFAULT_LIMIT);
  return levelModel.getRecentLevels({
    symbolAliases: userSymbols.map((obj) => obj.symbolAlias)
  }, offset, limit);
};

export const getLevelById = async (levelId: number): Promise<ILevelModel | undefined> => {
  const levels = await levelModel.getLevel({id: levelId});
  return _.head(levels);
};
