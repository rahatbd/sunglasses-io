import {describe, before, after, test} from 'node:test';
import {equal, deepEqual} from 'node:assert/strict';
import {startServer, closeServer, fetchData} from './helpers.js';
import {brands, products} from '../app/data.js';
import app from '../app/app.js';

describe('Products API', () => {
    before(async () => {
        await startServer(app);
    });

    test('GET /api/products should return all products', async () => {
        const {response, result} = await fetchData('products');
        equal(response.status, 200);
        deepEqual(result, products);
    });

    test('GET /api/products should filter products by name', async () => {
        const search = 'sUpEr';
        const {response, result} = await fetchData(`products?q=${encodeURIComponent(search)}`);
        equal(response.status, 200);
        const searchProducts = products.filter(product => product.name.toLowerCase().includes(search.toLowerCase()));
        deepEqual(result, searchProducts);
    });

    test('GET /api/products should filter products by description', async () => {
        const search = 'Best Glasses';
        const {response, result} = await fetchData(`products?q=${encodeURIComponent(search)}`);
        equal(response.status, 200);
        const searchProducts = products.filter(product => product.description.toLowerCase().includes(search.toLowerCase()));
        deepEqual(result, searchProducts);
    });

    test('GET /api/products should filter products by brand', async () => {
        const search = 'oAk';
        const {response, result} = await fetchData(`products?q=${encodeURIComponent(search)}`);
        equal(response.status, 200);
        const searchBrandIds = brands.filter(brand => brand.name.toLowerCase().includes(search.toLowerCase())).map(brand => brand.id);
        const searchProducts = products.filter(product => searchBrandIds.includes(product.categoryId));
        deepEqual(result, searchProducts);
    });

    test('GET /api/products should return an empty array when no products match', async () => {
        const search = 'No matching product or brand';
        const {response, result} = await fetchData(`products?q=${encodeURIComponent(search)}`);
        equal(response.status, 200);
        deepEqual(result, []);
    });

    test('GET /api/products should return 400 for repeated search parameters', async () => {
        const {response, result} = await fetchData('products?q=oakley&q=rayban');
        equal(response.status, 400);
        equal(typeof result.error, 'string');
    });

    after(async () => {
        await closeServer();
    });
});
