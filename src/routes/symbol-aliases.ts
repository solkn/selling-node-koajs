import * as Router from 'koa-router';

import * as SymbolsController from '../controllers/symbol-aliases';
import * as SymbolsValidator from '../validators/symbol-aliases';
import { adminAuthorization } from '../middlewares/admin-authorization';

const router = new Router({
  prefix: '/api/v1/symbols'
});

router.get('/aliases/:platform',
  SymbolsValidator.searchSymbolAliasesByPlatform,
  SymbolsController.searchSymbolAliasesByPlatform);

router.put('/aliases/alice', adminAuthorization(), SymbolsController.updateAliceInstruments);

export default router.routes();
