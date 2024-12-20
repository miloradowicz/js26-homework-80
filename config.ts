import path from 'path';

const rootPath = __dirname;

const config = {
  express: { port: 8000 },
  rootPath,
  publicPath: path.join(rootPath, 'public'),
  connectionConfig: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'miloradowicz_hw80',
  },
};

export default config;
