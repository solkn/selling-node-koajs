import * as compose from 'koa-compose';
import { Middleware } from 'koa';
import Auth from './auth';
import Levels from './levels';
import Signals from './signals';
import SymbolAliases from './symbol-aliases';
import Users from './users';
import Alice from './alice';
import Subscription from './subscription';

const routes: Middleware[] = [
  Auth,
  Levels,
  Signals,
  SymbolAliases,
  Users,
  Alice,
  Subscription,
];
export default () => compose(routes);
