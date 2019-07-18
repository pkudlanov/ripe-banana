require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
// const Reviewer = require('../lib/models/Reviewer');

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

    it('makes a new reviewer with POST', () => {
        return request(app)
            .post('/api/v1/reviewers')
            .send({
                name: 'Johnny Orangeseed',
                company: 'Johnny\'s Opinions'
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    name: 'Johnny Orangeseed',
                    company: 'Johnny\'s Opinions',
                    __v: 0
                });
            });
    });
    // reviewers will get POST, GET, GET:id, PUT
});
