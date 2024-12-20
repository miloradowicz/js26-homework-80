import express from 'express';
import config from './config';
import categoriesRouter from './routers/categories';
import locationsRouter from './routers/locations';
import resourcesRouter from './routers/resources';
import mysqlDb from './mysqlDb';

const app = express();
const port = config.express.port;

app.use(express.json());
app.use(express.static('public'));

app.use('/categories', categoriesRouter);
app.use('/locations', locationsRouter);
app.use('/resources', resourcesRouter);

(async () => {
  await mysqlDb.init();

  app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}/`);
  });
})();
