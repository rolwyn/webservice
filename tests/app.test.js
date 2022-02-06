import supertest from 'supertest'
import app from '../api/app.js'

const api = supertest(app)

test('HTTP Status code is 200, OK', async () => {
    await api
        .get('/healthz')
        .expect(200)
})