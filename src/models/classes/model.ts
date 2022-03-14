import { db } from '../../utils/knex-init';
import { Knex } from 'knex';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '../../constants/common-constants';
import { IUserModel } from '../interfaces/user-model';
import { ISignalModel } from '../interfaces/signal-model';
import { ILevelModel } from '../interfaces/level-model';
import { ISymbolAliasModel } from '../interfaces/symbol-alias-model';
import { IUserSymbolModel } from '../interfaces/user-symbol-model';
import { IOrderHistoryModel } from '../interfaces/order-history-model';
import { IUserPaymentModel } from '../interfaces/user-payment-model';
import { IUserFcmTokenModel } from '../interfaces/user-fcm-token-model';
import { IAliceFields, IToken } from '../../interfaces/common-interfaces';
import { UserType } from '../../constants/user-type';
import { Exchange } from '../../constants/exchange';
import * as moment from 'moment';
import { OrderType } from '../../constants/order-type';
import { Platform } from '../../constants/platform';


 export abstract class Model<T> {

  public readonly COL_ID = `${this.alias}.id`;
  public readonly COL_UPDATED_ON = `${this.alias}.updatedOn`;
  public readonly COL_CREATED_ON = `${this.alias}.createdOn`;

  protected get atable(): Knex.QueryBuilder {
    const identifier: any = {};
    identifier[this.alias] = this.tableName;

    return db(identifier);
  }

  protected get table(): Knex.QueryBuilder {
    

    return db(this.tableName);

    
  }

  protected get tableWithColumns(): Knex.QueryBuilder {
    return this.atable.columns().columns([this.COL_ID, this.COL_UPDATED_ON, this.COL_CREATED_ON]);
  }

  protected constructor(private tableName: string, private alias: string, private columns: string[]) {
  }
  


  public insert(object: T, returning?: string | string[]): Knex.QueryBuilder {
     return this.table.insert({object,returning});
  }
 
  public bulkInsert(rows: T[]): Knex.QueryBuilder {
    return db.bathInsert(this.tableName,rows);
    
  }

  public update(object: T, where: any, returning?: string | string[]): Knex.QueryBuilder {
    return this.table.update({object,returning}).where(where);
  }

  public delete(where: any): Knex.QueryBuilder {
    return this.table.delete().where(where);
  }
 
  public get(where: any = {}, offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT): Knex.QueryBuilder {
    return this.tableWithColumns.select().where(where).offset(offset).limit(limit);
  }









  public getUser(where: any = {}, offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT):Knex.QueryBuilder{
    return this.tableWithColumns.select(UserModel.COLUMNS).where(where).offset(offset).limit(limit);
    
  }
  

 
  public storeUser(user:IUserModel):Knex.QueryBuilder{
    return this.table.insert(user);

  }
  public updateUser(user:IUserModel,where:any):Knex.QueryBuilder{
    return this.table.update(user).where(where);

  }

  public deleteUsers(where:any){
    return this.table.delete().where(where);

  }



  public getSignal(where: any = {}, offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT):Knex.QueryBuilder{
    return this.tableWithColumns.select(SignalModel.COLUMNS).where(where).offset(offset).limit(limit);
  }
  public storeSignal(signal:ISignalModel):Knex.QueryBuilder{
    return this.table.insert(signal);

  }
  public updateSignal(signal:ISignalModel,where:any ={}):Knex.QueryBuilder{
    return this.table.update(signal).where(where);

  }

  public deleteSignal(where:any){
    return this.table.delete().where(where);

  }



  public getLevel(where: any = {}, offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT):Knex.QueryBuilder{
    return this.tableWithColumns.select(LevelModel.COLUMNS).where(where).offset(offset).limit(limit);
  }
  public storeLevel(level:ILevelModel):Knex.QueryBuilder{
    return this.table.insert(level);

  }
  public updateLevel(level:ILevelModel,where:any):Knex.QueryBuilder{
    return this.table.update(level).where(where);

  }

  public deleteLevel(where:any){
    return this.table.delete().where(where);

  }



  public getSymbolAliases(where: any = {}, offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT):Knex.QueryBuilder{
    return this.tableWithColumns.select(SymbolAliasModel.COLUMNS).where(where).offset(offset).limit(limit);
  }
  public storeSymbolAliases(symbolAliases:ISymbolAliasModel):Knex.QueryBuilder{
    return this.table.insert(symbolAliases);

  }
  public updateSymbolAliases(symbolAliases:ISymbolAliasModel,where:any):Knex.QueryBuilder{
    return this.table.update(symbolAliases).where(where);

  }

  public deleteSymbolAliases(where:any){
    return this.table.delete().where(where);

  }


  public getUserSymbols(where: any = {}, offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT):Knex.QueryBuilder{
    return this.tableWithColumns.select(UserSymbolModel.COLUMNS).where(where).offset(offset).limit(limit);
  }
  public storeUserSymbols(userSymbols:IUserSymbolModel):Knex.QueryBuilder{
    return this.table.insert(userSymbols);

  }
  public updateUserSymbols(userSymbols:IUserSymbolModel,where:any):Knex.QueryBuilder{
    return this.table.update(userSymbols).where(where);

  }

  public deletUserSymbols(where:any){
    return this.table.delete().where(where);

  }


  public getOrderHistories(where: any = {}, offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT):Knex.QueryBuilder{
    return this.tableWithColumns.select(OrderHistoryModel.COLUMNS).where(where).offset(offset).limit(limit);
  }
  public storeOrderHistories(orderHistories:IOrderHistoryModel):Knex.QueryBuilder{
    return this.table.insert(orderHistories);

  }
  public updateOrderHistories(orderHistories:IOrderHistoryModel,where:any):Knex.QueryBuilder{
    return this.table.update(orderHistories).where(where);

  }

  public deleteOrderHitories(where:any){
    return this.table.delete().where(where);

  }



  public getUserPayments(where: any = {}, offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT):Knex.QueryBuilder{
    return this.tableWithColumns.select(UserPaymentModel.COLUMNS).where(where).offset(offset).limit(limit);
  }
  public storeUserPayments(userPayments:IUserPaymentModel):Knex.QueryBuilder{
    return this.table.insert(userPayments);

  }
  public updateUserPayments(userPayments:IUserPaymentModel,where:any):Knex.QueryBuilder{
    return this.table.update(userPayments).where(where);

  }

  public deleteusrerPayments(where:any){
    return this.table.delete().where(where);

  }



  public getUserFcmToken(where: any = {}, offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT):Knex.QueryBuilder{
    return this.tableWithColumns.select(UserFcmTokenModel.COLUMNS).where(where).offset(offset).limit(limit);
  }
  public storeUserFcmToken(userFcmToken:IUserFcmTokenModel):Knex.QueryBuilder{
    return this.table.insert(userFcmToken);

  }
  public updateFcmToken(userFcmToken:IUserFcmTokenModel,where:any):Knex.QueryBuilder{
    return this.table.update(userFcmToken).where(where);

  }

  public deleteFcmToken(where:any){
    return this.table.delete().where(where);

  }



}





// User Model

export class UserModel extends Model<IUserModel> {

  public static TABLE_NAME = 'users';
  public static ALIAS = 'U';
  public static COL_NAME = `${UserModel.ALIAS}.name`;
  public static COL_EMAIL = `${UserModel.ALIAS}.email`;
  public static COL_PASSWORD = `${UserModel.ALIAS}.password`;
  public static COL_PHONE_NUMBER = `${UserModel.ALIAS}.phoneNumber`;
  public static COL_TEMPORARY_PASSWORD = `${UserModel.ALIAS}.temporaryPassword`;
  public static COL_TOKEN = `${UserModel.ALIAS}.token`;
  public static COL_ALICE_USERNAME = `${UserModel.ALIAS}.aliceUsername`;
  public static COL_ALICE_PASSWORD = `${UserModel.ALIAS}.alicePassword`;
  public static COL_ALICE_ANSWER = `${UserModel.ALIAS}.aliceAnswer`;
  public static COL_ALICE_TOKEN = `${UserModel.ALIAS}.aliceToken`;
  public static COL_ALICE_BRANCH_CODE = `${UserModel.ALIAS}.aliceBranchCode`;
  public static COL_USER_TYPE = `${UserModel.ALIAS}.userType`;
  public static COL_SUBSCRIPTION_TYPE = `${UserModel.ALIAS}.subscriptionType`;
  public static COL_SUBSCRIPTION_EXPIRE_ON = `${UserModel.ALIAS}.subscriptionExpireOn`;



  public static COLUMNS = [
    UserModel.COL_NAME,
    UserModel.COL_EMAIL,
    UserModel.COL_PASSWORD,
    UserModel.COL_PHONE_NUMBER,
    UserModel.COL_TEMPORARY_PASSWORD,
    UserModel.COL_TOKEN,
    UserModel.COL_ALICE_USERNAME,
    UserModel.COL_ALICE_PASSWORD,
    UserModel.COL_ALICE_ANSWER,
    UserModel.COL_ALICE_TOKEN,
    UserModel.COL_ALICE_BRANCH_CODE,
    UserModel.COL_USER_TYPE,
    UserModel.COL_SUBSCRIPTION_TYPE,
    UserModel.COL_SUBSCRIPTION_EXPIRE_ON,
  ];

  constructor() {
    super(UserModel.TABLE_NAME, UserModel.ALIAS, UserModel.COLUMNS);
  }

  public getById(id: number): Knex.QueryBuilder {
    const qb = this.getUser({id});
    return this.addCustomColumns(qb);
  }

  public getByIToken(itoken: IToken): Knex.QueryBuilder {
    const qb = this.getUser(itoken)
      .columns([
        UserModel.COL_ALICE_USERNAME,
        UserModel.COL_ALICE_PASSWORD,
        UserModel.COL_ALICE_ANSWER,
        UserModel.COL_ALICE_TOKEN,
      ]);

    return this.addCustomColumns(qb);
  }

  

  public getByPhoneNumber(phoneNumber: string): Knex.QueryBuilder {
    const qb = this.getUser({}).where(UserModel.COL_PHONE_NUMBER, phoneNumber);
    return this.addCustomColumns(qb);
  }

  public getByEmail(email: string): Knex.QueryBuilder {
    const where: any = {};
    where[UserModel.COL_EMAIL] = email;
    const qb = this.getUser(where);
    return this.addCustomColumns(qb);
  }

  public getByAliceUsername(aliceUsername: string): Knex.QueryBuilder {
    const where: any = {};
    where[UserModel.COL_ALICE_USERNAME] = aliceUsername;
    const qb = this.getUser(where);
    return this.addCustomColumns(qb);
  }

  public getByEmailAndPassword(email: string, password: string): Knex.QueryBuilder {
    const where: any = {};
    where[UserModel.COL_EMAIL] = email;
    where[UserModel.COL_PASSWORD] = password;

    const qb = this.getUser(where);
    return this.addCustomColumns(qb);
  }

  public getByEmailAndTemporaryPassword(email: string, password: string): Knex.QueryBuilder {
    const where: any = {};
    where[UserModel.COL_EMAIL] = email;
    where[UserModel.COL_TEMPORARY_PASSWORD] = password;
    const qb = this.getUser(where);
    return this.addCustomColumns(qb);
  }

  public async getCountByAliceUserType(query: any) {
    const qb = this.atable.count()
      .where(UserModel.COL_USER_TYPE, UserType.ALICE);
    if (query.aliceBranchCode) {
      qb.where(UserModel.COL_ALICE_BRANCH_CODE, query.aliceBranchCode);
    }
    if (query.subscriptionType) {
      qb.where(UserModel.COL_SUBSCRIPTION_TYPE, query.subscriptionType);
    }
    if (query.startDate) {
      qb.whereRaw(`DATE(${new UserModel().COL_CREATED_ON}) >= ?`, moment(query.startDate).format('YYYY-MM-DD'));
    }
    if (query.endDate) {
      qb.whereRaw(`DATE(${new UserModel().COL_CREATED_ON}) <= ?`, moment(query.endDate).format('YYYY-MM-DD'));
    }
    const result = await qb;
    return result[0]['count(*)'];
  }

  public getByAliceUserType(query: any, offset: number, limit: number) {
    const qb = this.getUser({
      userType: UserType.ALICE
    }, offset, limit);
    if (query.aliceBranchCode) {
      qb.where(UserModel.COL_ALICE_BRANCH_CODE, query.aliceBranchCode);
    }
    if (query.subscriptionType) {
      qb.where(UserModel.COL_SUBSCRIPTION_TYPE, query.subscriptionType);
    }
    if (query.startDate) {
      qb.whereRaw(`DATE(${new UserModel().COL_CREATED_ON}) >= ?`, moment(query.startDate).format('YYYY-MM-DD'));
    }
    if (query.endDate) {
      qb.whereRaw(`DATE(${new UserModel().COL_CREATED_ON}) <= ?`, moment(query.endDate).format('YYYY-MM-DD'));
    }
    return qb;
  }

  public updateUserTemporaryPassword(userId: number, temporaryPassword: string | null) {
    return this.updateUser({
      temporaryPassword
    } as IUserModel, {id: userId});
  }

  public updateUserPassword(userId: number, password: string | null) {
    return this.updateUser({
      password
    } as IUserModel, {id: userId});
  }

  public updateAliceToken(userId: number, aliceToken: string) {
    return this.updateUser({
      aliceToken
    } as IUserModel, {id: userId});
  }

  public updateAliceFields(userId: number, aliceFields: IAliceFields) {
    return this.updateUser(aliceFields as IUserModel, {id: userId});
  }

  // noinspection JSMethodCanBeStatic
  private addCustomColumns(qb: Knex.QueryBuilder): Knex.QueryBuilder {
    return qb.select(db.raw(`IF(ISNULL(${UserModel.COL_ALICE_USERNAME}), false, true) AS isAliceLoggedIn`));

  }

  
}


// Signal Model

export class SignalModel extends Model<ISignalModel> {
  public static TABLE_NAME = 'signals';
  public static ALIAS = 'S';
  public static COL_SIGNAL_ID = `${SignalModel.ALIAS}.signalId`;
  public static COL_SYMBOL_NAME = `${SignalModel.ALIAS}.symbolName`;
  public static COL_SYMBOL_ALIAS = `${SignalModel.ALIAS}.symbolAlias`;
  public static COL_EXCHANGE = `${SignalModel.ALIAS}.exchange`;
  public static COL_ORDER_TYPE = `${SignalModel.ALIAS}.orderType`;
  public static COL_PRICE = `${SignalModel.ALIAS}.price`;
  public static COL_TARGET1 = `${SignalModel.ALIAS}.target1`;
  public static COL_TARGET2 = `${SignalModel.ALIAS}.target2`;
  public static COL_TARGET3 = `${SignalModel.ALIAS}.target3`;
  public static COL_STOP_LOSS = `${SignalModel.ALIAS}.stopLoss`;
  public static COL_PROFIT_1 = `${SignalModel.ALIAS}.profit1`;
  public static COL_PROFIT_2 = `${SignalModel.ALIAS}.profit2`;
  public static COL_PROFIT_3 = `${SignalModel.ALIAS}.profit3`;
  public static COL_TOTAL_PROFIT = `${SignalModel.ALIAS}.totalProfit`;

  public static COLUMNS = [
    SignalModel.COL_SIGNAL_ID,
    SignalModel.COL_SYMBOL_NAME,
    SignalModel.COL_SYMBOL_ALIAS,
    SignalModel.COL_EXCHANGE,
    SignalModel.COL_ORDER_TYPE,
    SignalModel.COL_TARGET1,
    SignalModel.COL_TARGET2,
    SignalModel.COL_TARGET3,
    SignalModel.COL_PRICE,
    SignalModel.COL_STOP_LOSS,
    SignalModel.COL_PROFIT_1,
    SignalModel.COL_PROFIT_2,
    SignalModel.COL_PROFIT_3,
    SignalModel.COL_TOTAL_PROFIT,
  ];

  constructor() {
    super(SignalModel.TABLE_NAME, SignalModel.ALIAS, SignalModel.COLUMNS);
  }

  public getRecentSignals(whereIn: {
                            symbolAliases: string[],
                          },
                          offset: number, limit: number) {
    return this.getSignal({}, offset, limit)
    .whereIn(SignalModel.COL_SYMBOL_ALIAS, whereIn.symbolAliases)
      .orderBy(this.COL_CREATED_ON, 'desc');
  }

  public getUpdateAbleForStopLoss(where: {
    symbolName: string,
    exchange: Exchange,
    stopLoss: number,
  }) {
    const whereQ: any = {};
    whereQ[SignalModel.COL_SYMBOL_NAME] = where.symbolName;
    whereQ[SignalModel.COL_EXCHANGE] = where.exchange;
    whereQ[SignalModel.COL_STOP_LOSS] = where.stopLoss;
    return this.getSignal(whereQ)
      .whereNull(SignalModel.COL_TOTAL_PROFIT)
      .whereRaw(`DATE(${this.COL_CREATED_ON}) = ?`, moment().format('YYYY-MM-DD'))
      .orderBy(this.COL_CREATED_ON, 'desc');
  }

  public getUpdateAbleForTarget(where: {
    symbolName: string,
    exchange: Exchange,
    target1?: number,
    target2?: number,
    target3?: number,
  }) {
    const whereQ: any = {};
    whereQ[SignalModel.COL_SYMBOL_NAME] = where.symbolName;
    whereQ[SignalModel.COL_EXCHANGE] = where.exchange;
    const qb = this.getSignal(whereQ)
      .whereRaw(`DATE(${this.COL_CREATED_ON}) = ?`, moment().format('YYYY-MM-DD'))
      .orderBy(this.COL_CREATED_ON, 'desc');

    if (where.target1) {
      qb.where(SignalModel.COL_TARGET1, where.target1);
      qb.whereNull(SignalModel.COL_PROFIT_1);
    }
    if (where.target2) {
      qb.where(SignalModel.COL_TARGET2, where.target2);
      qb.whereNull(SignalModel.COL_PROFIT_2);
      qb.whereNotNull(SignalModel.COL_PROFIT_1);
      qb.where(SignalModel.COL_PROFIT_1, '>', 0);
    }
    if (where.target3) {
      qb.where(SignalModel.COL_TARGET3, where.target3);
      qb.whereNull(SignalModel.COL_PROFIT_3);
      qb.whereNotNull(SignalModel.COL_PROFIT_1);
      qb.whereNotNull(SignalModel.COL_PROFIT_2);
      qb.where(SignalModel.COL_PROFIT_1, '>', 0);
    }

    return qb;
  }

  public getTodayBy(where: {
    symbolName: string,
    exchange: Exchange,
    orderType: OrderType,
  }) {
    return this.getSignal(where)
      .whereRaw(`DATE(${this.COL_CREATED_ON}) = ?`, moment().format('YYYY-MM-DD'));
  }
}


// Level Model


export class LevelModel extends Model<ILevelModel> {
  public static TABLE_NAME = 'levels';
  public static ALIAS = 'L';
  public static COL_SIGNAL_ID = `${LevelModel.ALIAS}.signalId`;
  public static COL_SYMBOL_NAME = `${LevelModel.ALIAS}.symbolName`;
  public static COL_SYMBOL_ALIAS = `${LevelModel.ALIAS}.symbolAlias`;
  public static COL_EXCHANGE = `${LevelModel.ALIAS}.exchange`;
  public static COL_DIGIT = `${LevelModel.ALIAS}.digit`;
  public static COL_BUY_PRICE = `${LevelModel.ALIAS}.buyPrice`;
  public static COL_BUY_TARGET1 = `${LevelModel.ALIAS}.buyTarget1`;
  public static COL_BUY_TARGET2 = `${LevelModel.ALIAS}.buyTarget2`;
  public static COL_BUY_TARGET3 = `${LevelModel.ALIAS}.buyTarget3`;
  public static COL_SELL_PRICE = `${LevelModel.ALIAS}.sellPrice`;
  public static COL_SELL_TARGET1 = `${LevelModel.ALIAS}.sellTarget1`;
  public static COL_SELL_TARGET2 = `${LevelModel.ALIAS}.sellTarget2`;
  public static COL_SELL_TARGET3 = `${LevelModel.ALIAS}.sellTarget3`;
  public static COL_STOP_LOSS = `${LevelModel.ALIAS}.stopLoss`;

  public static COLUMNS = [
    LevelModel.COL_SIGNAL_ID,
    LevelModel.COL_SYMBOL_NAME,
    LevelModel.COL_SYMBOL_ALIAS,
    LevelModel.COL_EXCHANGE,
    LevelModel.COL_DIGIT,
    LevelModel.COL_BUY_PRICE,
    LevelModel.COL_BUY_TARGET1,
    LevelModel.COL_BUY_TARGET2,
    LevelModel.COL_BUY_TARGET3,
    LevelModel.COL_SELL_PRICE,
    LevelModel.COL_SELL_TARGET1,
    LevelModel.COL_SELL_TARGET2,
    LevelModel.COL_SELL_TARGET3,
    LevelModel.COL_STOP_LOSS,
  ];

  constructor() {
    super(LevelModel.TABLE_NAME, LevelModel.ALIAS, LevelModel.COLUMNS);
  }

  public getRecentLevels(whereIn: {
                           symbolAliases: string[],
                         },
                         offset: number, limit: number) {

    return this.getUserFcmToken({}, offset, limit)
      .select(db.raw(`(
      SELECT json_extract(${SymbolAliasModel.COL_OTHER_DATA}, '$.lotSize')
          FROM ${SymbolAliasModel.TABLE_NAME} AS ${SymbolAliasModel.TABLE_ALIAS}
          WHERE ${SymbolAliasModel.COL_NAME} = ${LevelModel.COL_SYMBOL_NAME}
          AND ${SymbolAliasModel.COL_EXCHANGE} = ${LevelModel.COL_EXCHANGE}
          LIMIT 1
          ) AS symbolLotSize
      `))
      .whereIn(LevelModel.COL_SYMBOL_ALIAS, whereIn.symbolAliases)
      .orderBy(this.COL_CREATED_ON, 'desc');
  }
}


// OrderHistory Model



export class OrderHistoryModel extends Model<IOrderHistoryModel> {

  public static TABLE_NAME = 'orderHistories';
  public static TABLE_ALIAS = 'OH';
  public static COL_USER_ID = `${OrderHistoryModel.TABLE_ALIAS}.userId`;
  public static COL_LEVEL_ID = `${OrderHistoryModel.TABLE_ALIAS}.levelId`;
  public static COL_ORDER_ID = `${OrderHistoryModel.TABLE_ALIAS}.orderId`;
  public static COL_ORDER_TYPE = `${OrderHistoryModel.TABLE_ALIAS}.orderType`;
  public static COL_QUANTITY = `${OrderHistoryModel.TABLE_ALIAS}.quantity`;
  public static COL_PRICE = `${OrderHistoryModel.TABLE_ALIAS}.price`;
  public static COL_TRIGGER_PRICE = `${OrderHistoryModel.TABLE_ALIAS}.triggerPrice`;
  public static COL_STOP_LOSS = `${OrderHistoryModel.TABLE_ALIAS}.stopLoss`;
  public static COL_TARGET = `${OrderHistoryModel.TABLE_ALIAS}.target`;
  public static COL_BRACKET_TYPE = `${OrderHistoryModel.TABLE_ALIAS}.bracketType`;
  public static COL_MONTH = `${OrderHistoryModel.TABLE_ALIAS}.month`;
  public static COL_TRADE_TYPE = `${OrderHistoryModel.TABLE_ALIAS}.tradeType`;

  public static map(input: any) {
    return {
      id: input.id,
      userId: input.userId,
      levelId: input.levelId,
      orderId: input.orderId,
      orderType: input.orderType,
      quantity: input.quantity,
      price: input.price,
      triggerPrice: input.triggerPrice,
      stopLoss: input.stopLoss,
      target: input.target,
      bracketType: input.bracketType,
      month: input.month,
      tradeType: input.tradeType,
    };
  }

  public static COLUMNS = [
    OrderHistoryModel.COL_USER_ID,
    OrderHistoryModel.COL_LEVEL_ID,
    OrderHistoryModel.COL_ORDER_ID,
    OrderHistoryModel.COL_ORDER_TYPE,
    OrderHistoryModel.COL_QUANTITY,
    OrderHistoryModel.COL_PRICE,
    OrderHistoryModel.COL_TRIGGER_PRICE,
    OrderHistoryModel.COL_STOP_LOSS,
    OrderHistoryModel.COL_TARGET,
    OrderHistoryModel.COL_BRACKET_TYPE,
    OrderHistoryModel.COL_MONTH,
    OrderHistoryModel.COL_TRADE_TYPE,
  ];

  constructor() {
    super(OrderHistoryModel.TABLE_NAME, OrderHistoryModel.TABLE_ALIAS, OrderHistoryModel.COLUMNS);
  }

  public getLatestByUserId(userId: number) {
    const qb = this.getUser({})
      .where(OrderHistoryModel.COL_USER_ID, userId)
      .orderBy(this.COL_CREATED_ON, 'desc');
    return this.leftJoinLevels(qb);
  }

  // noinspection JSMethodCanBeStatic
  private leftJoinLevels(qb: Knex.QueryBuilder) {
    return qb.leftJoin(`${LevelModel.TABLE_NAME} AS ${LevelModel.ALIAS}`,
      new LevelModel().COL_ID, OrderHistoryModel.COL_LEVEL_ID)
      .columns({
        symbolName: LevelModel.COL_SYMBOL_NAME,
        exchange: LevelModel.COL_EXCHANGE,
        symbolAlias: LevelModel.COL_SYMBOL_ALIAS,
      });
  }
}


// SymbolAlias Model



export class SymbolAliasModel extends Model<ISymbolAliasModel> {
  public static readonly TABLE_NAME = 'symbolAliases';
  public static readonly TABLE_ALIAS = 'SA';

  public static readonly COL_NAME = `${SymbolAliasModel.TABLE_ALIAS}.name`;
  public static readonly COL_ALIAS = `${SymbolAliasModel.TABLE_ALIAS}.alias`;
  public static readonly COL_EXCHANGE = `${SymbolAliasModel.TABLE_ALIAS}.exchange`;
  public static readonly COL_COMPANY = `${SymbolAliasModel.TABLE_ALIAS}.company`;
  public static readonly COL_OTHER_DATA = `${SymbolAliasModel.TABLE_ALIAS}.otherData`;
  public static readonly COL_PLATFORM = `${SymbolAliasModel.TABLE_ALIAS}.platform`;

  public static readonly COLUMNS = [
    SymbolAliasModel.COL_NAME,
    SymbolAliasModel.COL_ALIAS,
    SymbolAliasModel.COL_EXCHANGE,
    SymbolAliasModel.COL_COMPANY,
    SymbolAliasModel.COL_OTHER_DATA,
    SymbolAliasModel.COL_PLATFORM,
  ];

  constructor() {
    super(SymbolAliasModel.TABLE_NAME, SymbolAliasModel.TABLE_ALIAS, SymbolAliasModel.COLUMNS);
  }

  public getById(id: number) {
    return this.getSymbolAliases({id});
  }

  public getByNameExchangePlatform(find: {
    name?: string,
    alias?: string,
    exchange?: Exchange,
    platform?: Platform,
  }) {
    const where: any = {};
    if (find.name) {
      where[SymbolAliasModel.COL_NAME] = find.name;
    }
    if (find.alias) {
      where[SymbolAliasModel.COL_ALIAS] = find.alias;
    }
    if (find.exchange) {
      where[SymbolAliasModel.COL_EXCHANGE] = find.exchange;
    }
    if (find.platform) {
      where[SymbolAliasModel.COL_PLATFORM] = find.platform;
    }
    return this.getSymbolAliases(where);
  }

  public getByIds(ids: number[]) {
    return this.getSymbolAliases({})
      .whereIn(this.COL_ID, ids);
  }

  public getBySymbolNames(symbolNames: string[]) {
    return this.getSymbolAliases({})
      .whereIn(SymbolAliasModel.COL_NAME, symbolNames);
  }

  public searchByName(find: {
    nameSearch: string,
    exchange?: Exchange,
    platform?: Platform,
  }) {
    const where: any = {};
    if (find.exchange) {
      where[SymbolAliasModel.COL_EXCHANGE] = find.exchange;
    }
    if (find.platform) {
      where[SymbolAliasModel.COL_PLATFORM] = find.platform;
    }
    return this.getSymbolAliases(where, 0, 10)
      .where(SymbolAliasModel.COL_NAME, 'like', `%${find.nameSearch}%`)
      .orderBy(SymbolAliasModel.COL_NAME, 'asc');
  }

  public deleteAllOfAlice() {
    return this.deleteSymbolAliases({
      platform: Platform.ALICE
    });
  }
}


// User FCM Token 



export class UserFcmTokenModel extends Model<IUserFcmTokenModel> {

  public static TABLE_NAME = 'userFcmTokens';
  public static TABLE_ALIAS = 'UFT';
  public static COL_USER_ID = `${UserFcmTokenModel.TABLE_ALIAS}.userId`;
  public static COL_FCM_TOKEN = `${UserFcmTokenModel.TABLE_ALIAS}.fcmToken`;

  public static COLUMNS = [
    UserFcmTokenModel.COL_USER_ID,
    UserFcmTokenModel.COL_FCM_TOKEN,
  ];

  constructor() {
    super(UserFcmTokenModel.TABLE_NAME, UserFcmTokenModel.TABLE_ALIAS, UserFcmTokenModel.COLUMNS);
  }

  public getByUserIds(userIds: number[]) {
    return this.getUserFcmToken().whereIn(UserFcmTokenModel.COL_USER_ID, userIds);
  }

  public getBySubscribedUsers(where: {
    symbolName: string,
    exchange: Exchange
  }) {
    return this.getUserFcmToken({})
      .leftJoin(`${UserModel.TABLE_NAME} AS ${UserModel.ALIAS}`,
        new UserModel().COL_ID, UserFcmTokenModel.COL_USER_ID)
      .rightJoin(`${UserSymbolModel.TABLE_NAME} AS ${UserSymbolModel.ALIAS}`,
        new UserModel().COL_ID, UserSymbolModel.COL_USER_ID)
      .leftJoin(`${SymbolAliasModel.TABLE_NAME} AS ${SymbolAliasModel.TABLE_ALIAS}`,
        new SymbolAliasModel().COL_ID, UserSymbolModel.COL_SYMBOL_ALIAS_ID)
      .where(UserModel.COL_SUBSCRIPTION_EXPIRE_ON, '>', new Date())
      .where(SymbolAliasModel.COL_NAME, where.symbolName)
      .where(SymbolAliasModel.COL_EXCHANGE, where.exchange);
  }
}


// User Payment Model


export class UserPaymentModel extends Model<IUserPaymentModel> {

  public static TABLE_NAME = 'userPayments';
  public static TABLE_ALIAS = 'UP';
  public static COL_USER_ID = `${UserPaymentModel.TABLE_ALIAS}.userId`;
  public static COL_SUBSCRIPTION_TYPE = `${UserPaymentModel.TABLE_ALIAS}.subscriptionType`;
  public static COL_ACCOUNT_ID = `${UserPaymentModel.TABLE_ALIAS}.accountId`;
  public static COL_ORDER_ID = `${UserPaymentModel.TABLE_ALIAS}.orderId`;
  public static COL_PAYMENT_ID = `${UserPaymentModel.TABLE_ALIAS}.paymentId`;
  public static COL_AMOUNT = `${UserPaymentModel.TABLE_ALIAS}.amount`;
  public static COL_CURRENCY = `${UserPaymentModel.TABLE_ALIAS}.currency`;
  public static COL_METHOD = `${UserPaymentModel.TABLE_ALIAS}.method`;
  public static COL_BANK = `${UserPaymentModel.TABLE_ALIAS}.bank`;
  public static COL_EMAIL = `${UserPaymentModel.TABLE_ALIAS}.email`;
  public static COL_PHONE_NUMBER = `${UserPaymentModel.TABLE_ALIAS}.phoneNumber`;
  public static COL_PAID_ON = `${UserPaymentModel.TABLE_ALIAS}.paidOn`;

  public static COLUMNS = [
    UserPaymentModel.COL_USER_ID,
    UserPaymentModel.COL_SUBSCRIPTION_TYPE,
    UserPaymentModel.COL_ACCOUNT_ID,
    UserPaymentModel.COL_ORDER_ID,
    UserPaymentModel.COL_PAYMENT_ID,
    UserPaymentModel.COL_AMOUNT,
    UserPaymentModel.COL_CURRENCY,
    UserPaymentModel.COL_METHOD,
    UserPaymentModel.COL_BANK,
    UserPaymentModel.COL_EMAIL,
    UserPaymentModel.COL_PHONE_NUMBER,
    UserPaymentModel.COL_PAID_ON,
  ];

  constructor() {
    super(UserPaymentModel.TABLE_NAME, UserPaymentModel.TABLE_ALIAS, UserPaymentModel.COLUMNS);
  }

  public async getTotalAmountOfAlice(query: { startDate?: Date, endDate?: Date }) {
    const qb = this.atable.sum(UserPaymentModel.COL_AMOUNT)
      .leftJoin(`${UserModel.TABLE_NAME} AS ${UserModel.ALIAS}`,
        new UserModel().COL_ID, UserPaymentModel.COL_USER_ID)
      .where(UserModel.COL_USER_TYPE, UserType.ALICE);
    if (query.startDate) {
      qb.whereRaw(`DATE(${new UserPaymentModel().COL_CREATED_ON}) >= ?`, moment(query.startDate).format('YYYY-MM-DD'));
    }
    if (query.endDate) {
      qb.whereRaw(`DATE(${new UserPaymentModel().COL_CREATED_ON}) <= ?`, moment(query.endDate).format('YYYY-MM-DD'));
    }
    const result = await qb;
    return result[0]['sum(`UP`.`amount`)'];
  }

  public getOfAlice(query: { startDate?: Date, endDate?: Date }, offset: number, limit: number) {
    const qb = this.getUserPayments({}, offset, limit)
      .leftJoin(`${UserModel.TABLE_NAME} AS ${UserModel.ALIAS}`,
        new UserModel().COL_ID, UserPaymentModel.COL_USER_ID)
      .columns({
        userName: UserModel.COL_NAME,
        userEmail: UserModel.COL_EMAIL,
      })
      .where(UserModel.COL_USER_TYPE, UserType.ALICE);
    if (query.startDate) {
      qb.whereRaw(`DATE(${new UserPaymentModel().COL_CREATED_ON}) >= ?`, moment(query.startDate).format('YYYY-MM-DD'));
    }
    if (query.endDate) {
      qb.whereRaw(`DATE(${new UserPaymentModel().COL_CREATED_ON}) <= ?`, moment(query.endDate).format('YYYY-MM-DD'));
    }
    return qb;
  }

  public async getCountOfAlice(query: { startDate?: Date, endDate?: Date }) {
    const qb = this.atable.count()
      .leftJoin(`${UserModel.TABLE_NAME} AS ${UserModel.ALIAS}`,
        new UserModel().COL_ID, UserPaymentModel.COL_USER_ID)
      .where(UserModel.COL_USER_TYPE, UserType.ALICE);
    if (query.startDate) {
      qb.whereRaw(`DATE(${new UserPaymentModel().COL_CREATED_ON}) >= ?`, moment(query.startDate).format('YYYY-MM-DD'));
    }
    if (query.endDate) {
      qb.whereRaw(`DATE(${new UserPaymentModel().COL_CREATED_ON}) <= ?`, moment(query.endDate).format('YYYY-MM-DD'));
    }
    const result = await qb;
    return result[0]['count(*)'];
  }
}


// User Symbol Model


export class UserSymbolModel extends Model<IUserSymbolModel> {
  public static TABLE_NAME = 'userSymbols';
  public static ALIAS = 'US';
  public static COL_USER_ID = `${UserSymbolModel.ALIAS}.userId`;
  public static COL_SYMBOL_ALIAS_ID = `${UserSymbolModel.ALIAS}.symbolAliasId`;
  public static COLUMNS = [
    UserSymbolModel.COL_USER_ID,
    UserSymbolModel.COL_SYMBOL_ALIAS_ID,
  ];

  constructor() {
    super(UserSymbolModel.TABLE_NAME, UserSymbolModel.ALIAS, UserSymbolModel.COLUMNS);
  }

  public getByUserId(userId: number, offset: number, limit: number) {
    const qb = this.getUserSymbols({}, offset, limit)
      .where(UserSymbolModel.COL_USER_ID, userId)
      .orderBy(SymbolAliasModel.COL_NAME, 'asc');
    this.leftJoinSymbolAliasesTable(qb);
    return qb;
  }

  public deleteByUserId(userId: number) {
    return this.deletUserSymbols({userId});
  }

  // noinspection JSMethodCanBeStatic
  private leftJoinSymbolAliasesTable(qb: Knex.QueryBuilder): void {
    // noinspection JSIgnoredPromiseFromCall
    qb.leftJoin(
      `${SymbolAliasModel.TABLE_NAME} AS ${SymbolAliasModel.TABLE_ALIAS}`,
      new SymbolAliasModel().COL_ID,
      UserSymbolModel.COL_SYMBOL_ALIAS_ID)
      .columns([
        {symbolName: SymbolAliasModel.COL_NAME},
        {symbolAlias: SymbolAliasModel.COL_ALIAS},
        {symbolExchange: SymbolAliasModel.COL_EXCHANGE},
      ]);
  }
}


