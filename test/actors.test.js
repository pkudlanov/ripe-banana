require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');

describe('app routes', () => {
    beforeAll(() => {
        connect();
    });

    beforeEach(() => {
        return mongoose.connection.dropDatabase();
    });

    let actor = null;
    let actor2 = null;
    beforeEach(async() => {
        actor = JSON.parse(JSON.stringify(await Actor.create({
            name: 'Robert Mafussa',
            dob: '1998-12-19',
            pob: 'Des Moines, Iowa'
        })));
        actor2 = JSON.parse(JSON.stringify(await Actor.create({
            name: 'Jestifious Promisthus',
            dob: '1728-04-17',
            pob: 'Athens, Greece'
        })));
        await Film.create({
            title: 'Markers Down Half Past 12',
            studio: 'Boss Studios',
            released: 2014,
            cast: [{ actor: actor2._id }]
        });
    });

    afterAll(() => {
        return mongoose.connection.close();
    });

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

    it('gets actor by id with GET:id', () => {
        return request(app)
            .get(`/api/v1/actors/${actor._id}`)
            .then(res => {
                console.log(res.body);
                expect(res.body.name).toEqual('Robert Mafussa');
            });
    });

    it('gets actor by id with GET:id in correct form', () => {
        return request(app)
            .get(`/api/v1/actors/${actor._id}`)
            .then(res => {
                expect(res.body).toEqual({
                    name: 'Robert Mafussa',
                    dob: expect.stringContaining('1998-12-19'),
                    pob: 'Des Moines, Iowa',
                    films: expect.any(Array)
                });
            });
    });

    it('updates the actor with PUT', async() => {
        return request(app)
            .put(`/api/v1/actors/${actor._id}`)
            .send({
                name: 'Bob Barkley',
                dob: '1972-12-08',
                pob: 'Portland, Oregon'
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    name: 'Bob Barkley',
                    dob: expect.stringContaining('1972-12-08'),
                    pob: 'Portland, Oregon',
                    __v: 0
                });
            });
    });

    it('deletes an actor with DELETE', () => {
        return request(app)
            .delete(`/api/v1/actors/${actor._id}`)
            .then(res => {
                expect(res.body).toEqual(actor);
            });
    });

    it('does not delete an actor if hes in a film with DELETE', () => {
        return request(app)
            .delete(`/api/v1/actors/${actor2._id}`)
            .then(res => {
                expect(res.body).not.toEqual(actor2);
            });
    });
});
