import { INext } from '../interfaces/next';
import * as UserSymbolsService from '../services/user-symbols';
import * as UsersService from '../services/users';
import { Context, Request, Response } from 'koa';
import { head, parseInt } from 'lodash';

export const getUsers = async (ctx:Context)=>{


  const users = await UsersService.getUsers();
 
  ctx.response.body = users;

  var usersObject = JSON.parse(JSON.stringify(ctx.response.body));

  console.log("users data:",usersObject);
  

  return users;
}

export const getUserById = async(ctx:Context)=>{

  const user = await UsersService.getUserById(ctx.params.id);
  
  ctx.response.body = user;

  if(!user){
    console.log("no user in this Id!");
  }
  const userObject = JSON.parse(JSON.stringify(user));
  console.log("user data:",userObject);

  return user;

}
export const getProfile = async (ctx: Context, next: INext) => {
  const user = await UsersService.getUserByIdWithToken(ctx.state.session.id);
  user!!.isByTemporaryPassword = false;
  UsersService.embedAuthorizationIntoUser(user!!);
  ctx.state.data = user;

  await next();
};

export const getByEmail = async (ctx: Context, next: INext) => {
  ctx.state.data = await UsersService.getUserByEmail(
    ctx.state.body.email,
    );
  await next();
};


export const getSymbolsByUserId = async (ctx: Context, next: INext) => {
  ctx.state.data = await UserSymbolsService.getUserSymbolsByUserId(
    ctx.state.session.id,
    ctx.state.offset,
    ctx.state.limit);
  await next();
};

export const selectUserSymbols = async (ctx: Context, next: INext) => {
  await UserSymbolsService.selectUserSymbols(ctx.state.session.id, ctx.state.body.symbolAliasIds);
  ctx.state.data = null;
  await next();
};

export const getAliceUsers = async (ctx: Context, next: INext) => {
  ctx.state.totalCount = await UsersService.getAliceUsersCount(ctx.state.query);
  ctx.state.data = await UsersService.getAliceUsers(ctx.state.query, ctx.state.offset, ctx.state.limit);
  await next();
};
