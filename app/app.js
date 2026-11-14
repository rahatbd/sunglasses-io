import express from 'express';
import swaggerUI from 'swagger-ui-express';
import {readFileSync} from 'node:fs';
import {parse} from 'yaml';

const app = express();
const swaggerDoc = parse(readFileSync(new URL('../swagger.yaml', import.meta.url), 'utf8'));

app.use(express.json());
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

export default app;
