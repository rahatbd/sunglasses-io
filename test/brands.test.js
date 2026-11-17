import {describe, before, after, test} from 'node:test';
import {equal, deepEqual} from 'node:assert/strict';
import {startServer, closeServer, fetchData} from './helpers.js';
import {brands, products} from '../app/data.js';
import app from '../app/app.js';

describe('Brands API', () => {
    before(async () => {
        await startServer(app);
    });

    test('GET /api/brands should return all brands', async () => {
        const {response, result} = await fetchData('brands');
        equal(response.status, 200);
        deepEqual(result, brands);
    });

    test('GET /api/brands/:id/products should return products for an existing brand', async () => {
        const brandId = '1';
        const {response, result} = await fetchData(`brands/${brandId}/products`);
        equal(response.status, 200);
        const brandProducts = products.filter(({categoryId}) => categoryId === brandId);
        deepEqual(result, brandProducts);
    });

    test('GET /api/brands/:id/products should return 404 for an unknown brand', async () => {
        const {response, result} = await fetchData('brands/xyz/products');
        equal(response.status, 404);
        equal(typeof result.error, 'string');
    });

    after(async () => {
        await closeServer();
    });
});
