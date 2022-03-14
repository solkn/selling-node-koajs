import { SymbolAliasModel } from '../models/classes/model';
import { ISymbolAliasModel } from '../models/interfaces/symbol-alias-model';
import { Platform } from '../constants/platform';
import { axiosAlice } from '../utils/axios-util';
import { Exchange } from '../constants/exchange';
import * as _ from 'lodash';
import * as Boom from 'boom';
import * as cron from 'node-cron';

const symbolAliasModel = new SymbolAliasModel();

export const getSymbolAliasById = async (symbolAliasId: number) => {
  const symbolAliases: ISymbolAliasModel[] = await symbolAliasModel.getById(symbolAliasId);
  return _.head(symbolAliases);
};

export const getSymbolAliasByNameAndExchange = async (find: {
  name?: string,
  alias?: string,
  exchange?: Exchange,
  platform?: Platform,
}) => {
  const symbolAliases: ISymbolAliasModel[] =
    await symbolAliasModel.getByNameExchangePlatform(find);
  return _.head(symbolAliases);
};

export const getAllSymbolAliases = () => {
  return symbolAliasModel.get({});
};

export const searchSymbolAliasesByName = (find: {
  nameSearch: string,
  exchange?: Exchange,
  platform?: Platform,
}) => {
  return symbolAliasModel.searchByName(find);
};

export const getSymbolAliasesByIds = (ids: number[]): Promise<ISymbolAliasModel[]> => {
  return symbolAliasModel.getByIds(ids);
};

export const getSymbolAliasesBySymbolNames = (symbolNames: string[]): Promise<ISymbolAliasModel[]> => {
  return symbolAliasModel.getBySymbolNames(symbolNames);
};

let isAliceInsertionInProgress = false;
export const updateAliceInstruments = async () => {
  if (isAliceInsertionInProgress) {
    throw Boom.badRequest('Update Alice Instruments already in progress');
  }
  isAliceInsertionInProgress = true;
  try {

    await symbolAliasModel.deleteAllOfAlice();

    // MCX
    const mcxResponse = await axiosAlice.get('contracts.json', {params: {exchanges: Exchange.MCX}});
    const itemsMCX: any[] = mcxResponse.data['MCX'];

    // NSE
    const nseResponse = await axiosAlice.get('contracts.json', {params: {exchanges: Exchange.NSE}});
    const itemsNSE: any = nseResponse.data;

    // NFO
    const nfoResponse = await axiosAlice.get('contracts.json', {params: {exchanges: Exchange.NFO}});
    const itemsNFO: any = nfoResponse.data;

    const items = _.concat(
      itemsMCX,
      itemsNSE['NSE-OTH'],
      itemsNSE['NSE-IND'],
      itemsNSE['NSE'],
      itemsNFO['NSE-FUT'],
      itemsNFO['NSE-OPT'],
    );

    const mcxSymbolsToInsert: ISymbolAliasModel[] = items
      .map((obj) => {
        return {
          name: obj.symbol,
          alias: obj.code,
          company: obj.company,
          exchange: obj.exchange,
          otherData: JSON.stringify({
            expiry: obj.expiry,
            exchange_code: obj.exchange_code,
          }),
          platform: Platform.ALICE,
        } as ISymbolAliasModel;
      });
    await symbolAliasModel.bulkInsert(mcxSymbolsToInsert);
  } catch (e) {
    throw e;
  } finally {
    isAliceInsertionInProgress = false;
  }

};

// -------------------------- cron job ------------------------------//
// to update alice instruments at every 7am PST
cron.schedule('* 2 * * *', async () => {
  // tslint:disable-next-line:no-console
  console.log('Crone job started: ' + new Date());
  try {
    await updateAliceInstruments();
  } catch (e) {
    // tslint:disable-next-line:no-console
    console.error(e.toString());
  }
  // tslint:disable-next-line:no-console
  console.log('Crone job ended' + new Date());
}, {});
