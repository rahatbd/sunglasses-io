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

app.get('/api/products', (request, response) => {
    const query = request.query.q;
    if (query !== undefined && typeof query !== 'string') return response.status(400).json({error: 'Search query must be a single string.'});
    const search = query?.trim().toLowerCase();
    if (!search) return response.status(200).json(products);
    const searchProducts = products.filter(product => {
        const brand = brands.find(item => item.id === product.categoryId);
        return (
            product.name.toLowerCase().includes(search) ||
            product.description.toLowerCase().includes(search) ||
            brand?.name.toLowerCase().includes(search)
        );
    });
    response.status(200).json(searchProducts);
});

export default app;
