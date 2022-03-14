import * as Koa from 'koa';
import routes from './routes';
import * as koaHelmet from 'koa-helmet';
import * as koaJson from 'koa-json';
import * as koaBodyParser from 'koa-bodyparser';
import { errorMiddleware } from './middlewares/error';
import { responseMiddleware } from './middlewares/response';
import { logError } from './utils/logger';
import { offsetLimitMiddleware } from './middlewares/offset-limit';


const app = new Koa();

app.use(koaBodyParser());

app.use(koaHelmet());
app.use(koaJson());

app.use(errorMiddleware);
app.use(offsetLimitMiddleware);
app.use(routes());
app.use(responseMiddleware);

const PORT = process.env.PORT || 2999;
app.listen(PORT, () => {
  // tslint:disable-next-line:no-console
  console.log(`API Started on port: ${PORT}`);
});

app.on('error', (error) => {
  logError(error);
});
