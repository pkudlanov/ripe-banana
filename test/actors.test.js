require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');

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

    // post, get, get:id, put, delete(only if not in any film)

    it('creates a new actor object with POST', () => {
        return request(app)
            .post('/api/v1/actors')
            .send({
                name: 'George Albertson',
                dob: '1917-05-09',
                pob: 'Hamburg, Germany'
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    name: 'George Albertson',
                    dob: expect.stringContaining('1917-05-09'),
                    pob: 'Hamburg, Germany',
                    __v: 0
                });
            });
    });

    it('gets all the acters with GET in object with id and name', async() => {
        const actors = await Actor.create([
            { name: 'Me', dob: '2014-03-28', pob: 'Giza, Egypt' },
            { name: 'Pam Jammie' },
            { name: 'Him' }
        ]);

        return request(app)
            .get('/api/v1/actors')
            .then(res => {
                const actorsJSON = JSON.parse(JSON.stringify(actors));
                actorsJSON.forEach(actor => {
                    expect(res.body).toContainEqual({
                        _id: actor._id,
                        name: actor.name
                    });
                });
            });
    });
});
