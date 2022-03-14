import { Context } from 'koa';
import { IMetaData } from '../interfaces/meta-data';
import * as Joi from 'joi';
import * as Boom from 'boom';
import { Keys } from '../constants/keys';

const isProduction = process.env.NODE_ENV === 'production';

export const errorMiddleware = async (ctx: Context, next: () => void) => {
  try {
    ctx.status = 200;
    await next();
  } catch (err) {
    let metaData: IMetaData;
    if (err.isJoi) {
      metaData = handleJoiError(err);
    } else if (err.isBoom) {
      metaData = handleBoomError(err);
    } else {
      metaData = handleDefaultError(err);
    }

    if (!isProduction) {
      metaData.stack = err.stack;
    }
    ctx.status = +metaData.status;
    ctx.body = {
      metaData
    };
    if (ctx.status === 500) {
      ctx.app.emit('error', err, ctx);
    }
  }
};

const handleJoiError = (err: Joi.ValidationError): IMetaData => {
  return {
    status: 400,
    message: err.details[0].message,
    key: Keys.JOI
  };
};

const handleBoomError = (err: Boom): IMetaData => {
  return {
    status: +err.output.statusCode,
    message: err.message,
    key: err.data || Keys.NONE
  };
};

const handleDefaultError = (err: any): IMetaData => {
  return {
    status: +err.status || 500,
    message: err.message || 'Internal server error',
    key: Keys.SERVER_ERROR
  };
};
