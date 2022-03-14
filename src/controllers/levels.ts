import { Context } from 'koa';
import { INext } from '../interfaces/next';
import * as LevelsService from '../services/levels';
import * as OrderHistoriesService from '../services/order-histories';


export const getLevels = async (ctx:Context)=>{

  const levels = await LevelsService.getLevels();

  ctx.response.body = levels;

  const levelObject = JSON.parse(JSON.stringify(ctx.response.body));


  console.log("signals are:",levelObject);
  
}
export const getLevelById = async(ctx:Context)=>{


const level = await LevelsService.getLevelById(ctx.params.id);

ctx.response.body = level;

const levelObject = JSON.parse(JSON.stringify(level));

if(!level){
  console.log("no user in this Id!");
}

console.log("leves are:",levelObject);
return level;

}

export const createLevel = async (ctx: Context) => {
  const level = await LevelsService.createLevel(ctx.request.body);
  ctx.response.body = level;
  
  return level;
};

export const getAllUserLevels = async (ctx: Context, next: INext) => {
  ctx.state.data = await LevelsService.getAllRecentUserLevels(ctx.state.session.id, ctx.state.offset, ctx.state.limit);
  await next();
};

export const getLevelOrderHistories = async (ctx: Context, next: INext) => {
  ctx.state.data = await OrderHistoriesService.getLatestOrderHistoriesByUserId(ctx.state.session.id);
  await next();
};
