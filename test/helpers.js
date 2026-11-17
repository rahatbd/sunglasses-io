import {once} from 'node:events';
import {promisify} from 'node:util';
import {ok} from 'node:assert/strict';

let server, baseUrl;

export async function startServer(app) {
    server = app.listen(0, '127.0.0.1');
    await once(server, 'listening');
    const {port} = server.address();
    baseUrl = `http://127.0.0.1:${port}`;
}

export async function closeServer() {
    if (!server?.listening) return;
    await promisify(server.close.bind(server))();
}

export async function fetchData(path) {
    const response = await fetch(`${baseUrl}/api/${path}`);
    ok(response.headers.get('content-type')?.includes('application/json'));
    const result = await response.json();
    return {response, result};
}
