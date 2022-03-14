import { axiosAlice, axiosAliceServices } from '../utils/axios-util';
import * as Boom from 'boom';
import * as UsersService from './users';
import { IAliceProfile, IBracketOrderAxiosBody, ICoverOrderAxiosBody } from '../interfaces/common-interfaces';
import * as qs from 'querystring';

export const loginAndTwfo = async (body: {
  username: string,
  password: string,
  answer: string,
}): Promise<{ publicToken: string } | never> => {
  const loginResponse = await login(body);
  try {
    return await twofa({
      ...body,
      questionIds: loginResponse.questionIds,
    });
  } catch {
    return await twofa({
      ...body,
      questionIds: loginResponse.questionIds,
    });
  }
};

export const getOldOrNewAliceToken = async (aliceUsername: string): Promise<string> => {
  const user = await UsersService.getUserByAliceUsernameWithPrivateFields(aliceUsername);
  if (!user) {
    throw Boom.notFound('Alice user not found');
  }

  let publicToken: string = '';
  if (user.aliceToken) {
    try {
      await getProfile(user.aliceToken);
      publicToken = user.aliceToken;
      // tslint:disable-next-line
    } catch {
    }
  }
  if (!publicToken) {
    const twofaResponse = await loginAndTwfo({
      username: user.aliceUsername!!,
      password: user.alicePassword!!,
      answer: user.aliceAnswer!!,
    });
    publicToken = twofaResponse.publicToken;
    await UsersService.updateAliceToken(user.id, publicToken);
  }
  return publicToken;
};

export const loginAndTwfoAndProfile = async (body: {
  username: string,
  password: string,
  answer: string,
}): Promise<IAliceProfile | never> => {
  const twfoResponse = await loginAndTwfo(body);
  return getProfile(twfoResponse.publicToken);
};

export const placeBracketOrder = async (body: IBracketOrderAxiosBody) => {
  try {

    const tradeResponse = await axiosAlice.post(
      'bracketorder', {
        exchange: body.exchange.toUpperCase(),
        instrument_token: body.instrumentToken,
        transaction_type: body.orderType.toUpperCase(),
        quantity: body.quantity,
        disclosed_quantity: 0,
        validity: 'DAY',
        square_off_value: Math.abs(body.target - body.price),
        stop_loss_value: Math.abs(body.stopLoss - body.price),
        price: body.price,
        trigger_price: body.triggerPrice || 0,
        order_type: body.bracketType.toUpperCase(),
        source: 'web'
      }, {
        headers: {
          'X-Authorization-Token': body.publicToken
        }
      });
    if (tradeResponse.data.status === 'error') {
      // noinspection ExceptionCaughtLocallyJS
      throw Boom.badRequest((typeof tradeResponse.data.message === 'object' ?
        tradeResponse.data.message.reason :
        tradeResponse.data.message) + ' | placeBracketOrder');
    }
    return {
      orderId: (tradeResponse.data && tradeResponse.data.data.oms_order_id) || 'N/A',
    };
  } catch (e) {
    throw boomifyAliceException(e, 'PLACE_BRACKET_ORDER');
  }
};

export const placeCoverOrder = async (body: ICoverOrderAxiosBody) => {
  try {

    const tradeResponse = await axiosAlice.post(
      'order', {
        exchange: body.exchange.toUpperCase(),
        instrument_token: body.instrumentToken,
        transaction_type: body.orderType.toUpperCase(),
        quantity: body.quantity,
        disclosed_quantity: 0,
        validity: 'DAY',
        price: body.price,
        trigger_price: body.stopLoss,
        product: 'CO',
        order_type: 'LIMIT',
        source: 'web'
      }, {
        headers: {
          'X-Authorization-Token': body.publicToken
        }
      });
    if (tradeResponse.data.status === 'error') {
      // noinspection ExceptionCaughtLocallyJS
      throw Boom.badRequest((typeof tradeResponse.data.message === 'object' ?
        tradeResponse.data.message.reason :
        tradeResponse.data.message) + ' | placeCoverOrder');
    }
    return {
      orderId: (tradeResponse.data && tradeResponse.data.data.oms_order_id) || 'N/A',
    };
  } catch (e) {
    throw boomifyAliceException(e, 'PLACE_COVER_ORDER');
  }
};

export const requestSignup = async (body: {
  name: string,
  email: string,
  phoneNumber: string,
  city: string,
  state: string,
}) => {
  try {
    const response = await axiosAliceServices.post('Clientdata.asmx/DigiLink_API', qs.stringify({
      Name: body.name,
      EmailID: body.email,
      MobileNo: body.phoneNumber,
      State: body.state,
      City: body.city,
      Source: 'SP13',
    }));
    return response.data[0];
  } catch (e) {
    throw Boom.serverUnavailable('Unknown error. Please try again');
  }
};

export const getBranchCode = async (aliceUsername: string): Promise<string> => {
  try {
    const response = await axiosAliceServices.get('ADVM.asmx/GetBranchCode', {
      params: {
        ClientCode: aliceUsername,
      },
    });
    return response.data.data.BranchCode;
  } catch {
    return 'N/A';
  }
};

// ------------------------ HELPER FUNCTIONS ---------------------- //

const login = async (body: {
  username: string,
  password: string
}):
  Promise<{ questionIds: string[] } | never> => {
  try {
    const loginResponse = await axiosAlice.post('login', {
      login_id: body.username,
      password: body.password,
      device: 'web'
    });
    if (loginResponse.data.status === 'error') {
      // noinspection ExceptionCaughtLocallyJS
      throw Boom.badRequest((typeof loginResponse.data.message === 'object' ?
        loginResponse.data.message.reason :
        loginResponse.data.message) + ' | login');
    } else {
      const questionIds = loginResponse.data.data.question_ids;
      return {
        questionIds
      };
    }
  } catch (e) {
    throw boomifyAliceException(e, 'LOGIN');
  }
};

const twofa = async (body: {
  username: string,
  questionIds: string[],
  answer: string
}): Promise<{ publicToken: string } | never> => {
  try {
    const twofaResponse = await axiosAlice.post(
      'checktwofa', {
        login_id: body.username,
        answers: [body.answer, body.answer],
        question_ids: body.questionIds,
        device: 'web',
        count: 2
      });
    if (twofaResponse.data.message) {
      // noinspection ExceptionCaughtLocallyJS
      throw Boom.badRequest((typeof twofaResponse.data.message === 'object' ?
        twofaResponse.data.message.reason :
        twofaResponse.data.message) + ' | twofa');
    } else {
      return {
        publicToken: twofaResponse.data.data.auth_token,
      };
    }
  } catch (e) {
    throw boomifyAliceException(e, 'TWOFA');
  }
};

const getProfile = async (aliceToken: string):
  Promise<IAliceProfile | never> => {
  try {
    const profileResponse = await axiosAlice.get('profile', {
      headers: {
        'X-Authorization-Token': aliceToken
      },
    });
    if (profileResponse.data.message) {
      // noinspection ExceptionCaughtLocallyJS
      throw Boom.badRequest((typeof profileResponse.data.message === 'object' ?
        profileResponse.data.message.reason :
        profileResponse.data.message) + ' | getProfile');
    } else {
      const data = profileResponse.data.data;
      return {
        panNumber: data.pan_number,
        name: data.name,
        username: data.login_id,
        exchanges: data.exchanges,
        email: data.email_address.toLowerCase(),
        brokerName: data.broker_name,
        token: aliceToken,
      };
    }
  } catch (e) {
    throw boomifyAliceException(e, 'GET_PROFILE');
  }
};

const boomifyAliceException = (e: any, tag: string) => {
  if (e.isBoom) {
    return e;
  }
  let errorMessage = 'N/A';
  if (e.response && e.response.data && e.response.data.message) {
    errorMessage = e.response.data.message;
  } else if (e.response && e.response.data) {
    errorMessage = typeof e.response.data === 'string' ? e.response.data : JSON.stringify(e.response.data);
  } else {
    errorMessage = 'Connection Timeout to alice server';
  }
  return Boom.boomify(new Error(`${errorMessage} | ${tag}`), {
    statusCode: e.response.status,
  });
};
