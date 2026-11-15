import express from 'express';
import swaggerUi from 'swagger-ui-express';
import {readFileSync} from 'node:fs';
import {parse} from 'yaml';
import {brands, products} from './data.js';

const app = express();
const swaggerDoc = parse(readFileSync(new URL('../swagger.yaml', import.meta.url), 'utf8'));

app.use(express.json());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.get('/api/brands', (_request, response) => {
    response.status(200).json(brands);
});

app.get('/api/brands/:id/products', (request, response) => {
    const brand = brands.find(item => item.id === request.params.id);
    if (!brand) return response.status(404).json({error: 'Brand not found.'});
    const brandProducts = products.filter(product => product.categoryId === brand.id);
    response.status(200).json(brandProducts);
});

export default app;
