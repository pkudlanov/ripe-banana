require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');

describe('app routes', () => {
    beforeAll(() => {
        connect();
    });

    beforeEach(() => {
        return mongoose.connection.dropDatabase();
    });

    let studio = null;
    let actor = null;
    beforeEach(async() => {
        studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'Grassy Studios' })));
        actor = JSON.parse(JSON.stringify(await Actor.create({ name: 'Mell Grady' })));
    });

    afterAll(() => {
        return mongoose.connection.close();
    });

    it('creates a new film with POST', () => {
        return request(app)
            .post('/api/v1/films')
            .send({
                title: 'Two Weeks to Breaking Sound',
                studio: studio._id,
                released: 2016,
                cast: [
                    { role: 'Billy Gatly', actor: actor._id }
                ]
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    title: 'Two Weeks to Breaking Sound',
                    studio: studio._id,
                    released: 2016,
                    cast: [
                        {
                            _id: expect.any(String),
                            role: 'Billy Gatly',
                            actor: actor._id
                        }
                    ],
                    __v: 0
                });
            });
    });

    it('gets all the films with GET', async() => {
        const films = await Film.create([
            {
                title: 'Don\'t flake it!',
                studio: studio._id,
                released: 1995,
                cast: [{ actor: actor._id }]
            }, {
                title: 'Shooting the Acorn',
                studio: studio._id,
                released: 2019,
                cast: [{ actor: actor._id }]
            }
        ]);

        return request(app)
            .get('/api/v1/films')
            .then(res => {
                const filmsJSON = JSON.parse(JSON.stringify(films));
                filmsJSON.forEach(film => {
                    expect(res.body).toContainEqual({
                        _id: film._id,
                        title: film.title,
                        released: film.released,
                        studio: {
                            _id: studio._id,
                            name: studio.name
                        }
                    });
                });
            });
    });
    
    it('gets a film by id with GET:id not correct form yet', async() => {
        const film = await Film.create({
            title: 'Flying Past the Moon',
            studio: studio._id,
            released: 2007,
            cast: [{
                role: 'James Walter',
                actor: actor._id
            }]
        });

        return request(app)
            .get(`/api/v1/films/${film._id}`)
            .then(res => {
                expect(res.body.title).toEqual('Flying Past the Moon');
            });
    });

    it('deletes a film by id with DELETE', async() => {
        const film = await Film.create({
            title: 'Reading the Bullet',
            studio: studio._id,
            released: 2009,
            cast: [{
                role: 'Jackie McGuire',
                actor: actor._id
            }]
        });

        console.log(film);

        return request(app)
            .delete(`/api/v1/films/${film._id}`)
            .then(res => {
                const filmJSON = JSON.parse(JSON.stringify(actor));
                expect(res.body).toEqual(filmJSON);
            });
    });
});
