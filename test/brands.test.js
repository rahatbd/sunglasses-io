import {describe, before, after, test} from 'node:test';
import {ok, equal, deepEqual} from 'node:assert/strict';
import {once} from 'node:events';
import {promisify} from 'node:util';
import {brands, products} from '../app/data.js';
import app from '../app/app.js';

describe('Brands API', () => {
    let baseUrl, server;

    before(async () => {
        server = app.listen(0, '127.0.0.1');
        await once(server, 'listening');
        const {port} = server.address();
        baseUrl = `http://127.0.0.1:${port}`;
    });

    async function fetchData(path) {
        const response = await fetch(`${baseUrl}/api/${path}`);
        ok(response.headers.get('content-type')?.includes('application/json'));
        const result = await response.json();
        return {response, result};
    }

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
        if (!server?.listening) return;
        await promisify(server.close.bind(server))();
    });
});
