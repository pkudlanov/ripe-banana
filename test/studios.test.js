require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');

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

    // name: {
    //     type: String,
    //     required: true
    // },
    // address: {
    //     city: String,
    //     state: String,
    //     country: String
    // }

    it('cretes a new studio object with POST', () => {
        return request(app)
            .post('/api/v1/studios')
            .send({
                name: 'Sugar Free Studios',
                address: {
                    city: 'Battle Ground',
                    state: 'Washington',
                    country: 'United States of America'
                }
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    name: 'Sugar Free Studios',
                    address: {
                        city: 'Battle Ground',
                        state: 'Washington',
                        country: 'United States of America'
                    },
                    __v: 0
                });
            });
    });

    it('returns all studios with GET in form of {id, name}', async() => {
        const studio = await Studio.create([
            { name: 'No. 2 Studios', address: { city: 'Portland' } },
            { name: 'Epic Creations' },
            { name: 'Watch Our Stuff' }
        ]);

        return request(app)
            .get('/api/v1/studios')
            .then(res => {
                const studioJSON = JSON.parse(JSON.stringify(studio));
                studioJSON.forEach(studio => {
                    expect(res.body).toContainEqual({
                        _id: studio._id,
                        name: studio.name
                    });
                });
            });
    });
});
