const supertest = require('supertest')
const app = require('../api/app')

const api = supertest(app)

test('HTTP Status code is 200, OK', async () => {
    await api
        .get('/healthz')
        .expect(200)
})