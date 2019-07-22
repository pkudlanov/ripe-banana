require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');
const Film = require('../lib/models/Film');
const Actor = require('../lib/models/Actor');

describe('app routes', () => {
    beforeAll(() => {
        connect();
    });

    beforeEach(() => {
        return mongoose.connection.dropDatabase();
    });

    let studio = null;
    let studio2 = null;
    let actor2 = null;
    beforeEach(async() => {
        studio = JSON.parse(JSON.stringify(await Studio.create({
            name: 'No. 2 Studios',
            address: { city: 'Portland' }
        })));
        studio2 = JSON.parse(JSON.stringify(await Studio.create({
            name: 'Cold Truth',
            address: { country: 'Georgia' }
        })));

        actor2 = JSON.parse(JSON.stringify(await Actor.create({
            name: 'Blaise Trumly'
        })));


        await Film.create({
            title: 'Mark Becomes a Bum',
            studio: studio2._id,
            released: 2016,
            cast: [{ actor: actor2._id }]
        });
    });

    afterAll(() => {
        return mongoose.connection.close();
    });

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
        const studios = await Studio.create([
            { name: 'No. 2 Studios', address: { city: 'Portland' } },
            { name: 'Epic Creations' },
            { name: 'Watch Our Stuff' }
        ]);

        return request(app)
            .get('/api/v1/studios')
            .then(res => {
                const studiosJSON = JSON.parse(JSON.stringify(studios));
                studiosJSON.forEach(studio => {
                    expect(res.body).toContainEqual({
                        _id: studio._id,
                        name: studio.name
                    });
                });
            });
    });

    it('returns studio by id with GET:id', async() => {
        return request(app)
            .get(`/api/v1/studios/${studio._id}`)
            .then(res => {
                expect(res.body.name).toEqual('No. 2 Studios');
            });
    });

    it('returns studio by id with GET:id in correct form', async() => {
        return request(app)
            .get(`/api/v1/studios/${studio._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    _id: studio._id,
                    name: 'No. 2 Studios',
                    address: { city: 'Portland' },
                    films: expect.any(Array)
                });
            });
    });

    it('deletes a studio with DELETE', () => {
        return request(app)
            .delete(`/api/v1/studios/${studio._id}`)
            .then(res => {
                const studioJSON = JSON.parse(JSON.stringify(studio));
                expect(res.body).toEqual(studioJSON);
            });
    });

    it('does not delete a studio if it has films with DELETE', () => {
        return request(app)
            .delete(`/api/v1/studios/${studio2._id}`)
            .then(res => {
                const studioJSON = JSON.parse(JSON.stringify(studio2));
                expect(res.body).not.toEqual(studioJSON);
            });
    });
});
