import { Context } from 'koa';
import { IState } from '../../src/interfaces/state';

declare module 'koa' {
  interface Context {
    state: IState;
  }
}
