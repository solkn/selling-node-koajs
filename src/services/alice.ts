import * as AliceApiService from './alice-api';
import { IBracketOrderAxiosBody, ICoverOrderAxiosBody } from '../interfaces/common-interfaces';

export const placeBracketOrder = async (aliceUsername: string, body: IBracketOrderAxiosBody) => {
  const publicToken = await AliceApiService.getOldOrNewAliceToken(aliceUsername);
  return AliceApiService.placeBracketOrder({
    //publicToken,
    ...body,
  });
};

export const placeCoverOrder = async (aliceUsername: string, body: ICoverOrderAxiosBody) => {
  const publicToken = await AliceApiService.getOldOrNewAliceToken(aliceUsername);
  return AliceApiService.placeCoverOrder({
    //publicToken,
    ...body,
  });
};
