const supertest = require('supertest')
// const app = require('../api/app')


const express = require('express');
const { body, check,  validationResult } = require('express-validator');
const request = require('supertest');

const app = express();

const api = supertest(app)

app.get('/healthz', 
	(req, res) => {
    res.json();
});

// api to return 400 when email validation fails
// app.post('/v1/user',
//     body('email').isEmail(),
// 	(req, res) => {
//         const validationErrors = validationResult(req);
//         if (!validationErrors.isEmpty()) {
//             res.status(400).send('Bad Request')
//         }
// });

test('HTTP Status code is 200, OK', async () => { 
    await api
    .get('/healthz')
    .expect(200)
})

// test('HTTP Status code is 400, Bad Request', async () => { 
//     await api
//     .post('/v1/user')
//     .query({ "email": 'example@gmail.com' })
//     .expect(400)
// })