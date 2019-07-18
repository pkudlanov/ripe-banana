require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
// const Film = require('../lib/models/Film');

describe('app routes', () => {
    beforeAll(() => {
        connect();
    });

    beforeEach(() => {
        return mongoose.connection.dropDatabase();
    });

    afterAll(() => {
        return mongoose.connection.close();
    });

    it('creates a new film with POST', () => {
        return request(app)
            .post('/api/v1/films')
            .send({
                title: 'Two Weeks to Breaking Sound',
                studio: '5d30f0adaa39090f44bf4db9',
                released: 2016,
                cast: [
                    { role: 'Billy Gatly', actor: '7d30f0ffcd39090f26ef4db9' }
                ]
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    title: 'Two Weeks to Breaking Sound',
                    studio: '5d30f0adaa39090f44bf4db9',
                    released: 2016,
                    cast: [
                        { role: 'Billy Gatly', actor: '7d30f0ffcd39090f26ef4db9' }
                    ],
                    __v: 0
                });
            });
    });
});
