require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/Reviewer');

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

    it('gets all the reviewers with GET ', async() => {
        const reviewers = await Reviewer.create([
            { name: 'Georgi Cooper', company: 'Coopers Tires' },
            { name: 'Sheldon Cooper', company: 'Unemployed' },
            { name: 'Albert Cromford', company: 'Needle Point Filmography' }
        ]);

        return request(app)
            .get('/api/v1/reviewers')
            .then(res => {
                const reviewersJSON = JSON.parse(JSON.stringify(reviewers));
                reviewersJSON.forEach(reviewer => {
                    expect(res.body).toContainEqual({
                        _id: reviewer._id,
                        name: reviewer.name,
                        company: reviewer.company
                    });
                });
            });
    });

    it('get the reviewer by id with GET:id', async() => {
        const reviewer = await Reviewer.create({
            name: 'Conner Pilsby',
            company: 'iWatchFilms'
        });

        return request(app)
            .get(`/api/v1/reviewers/${reviewer._id}`)
            .then(res => {
                expect(res.body.name).toEqual('Conner Pilsby');
            });
    });
    
    it('updates the reviewer with PUT', async() => {
        const reviewer = await Reviewer.create({
            name: 'Mike Spence',
            company: 'Living in the Theater'
        });

        return request(app)
            .put(`/api/v1/reviewers/${reviewer._id}`)
            .send({
                name: 'Arnold Spence',
                company: 'Theater Life'
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    name: 'Arnold Spence',
                    company: 'Theater Life',
                    __v: 0
                });
            });
    });
});
