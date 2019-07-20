require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/Reviewer');
const Review = require('../lib/models/Review');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');

describe('app routes', () => {
    beforeAll(() => {
        connect();
    });

    beforeEach(() => {
        return mongoose.connection.dropDatabase();
    });

    let film1 = null;
    let film2 = null;
    let reviewer = null;
    let studio = null;
    let actor = null;
    beforeEach(async() => {
        reviewer = JSON.parse(JSON.stringify(await Reviewer.create({
            name: 'Mike Spence',
            company: 'Living in the Theater'
        })));
        studio = JSON.parse(JSON.stringify(await Studio.create({
            name: 'Stupid Films'
        })));
        actor = JSON.parse(JSON.stringify(await Actor.create({
            name: 'Billy Joel'
        })));
        film1 = JSON.parse(JSON.stringify(await Film.create({
            title: 'Joes Film',
            studio: studio._id,
            released: 1998,
            cast: [{ actor: actor._id }]
        })));
        film2 = JSON.parse(JSON.stringify(await Film.create({
            title: 'Nails',
            studio: studio._id,
            released: 1997,
            cast: [{ actor: actor._id }]
        })));
        await Review.create([{
            rating: 4,
            reviewer: reviewer._id,
            review: 'This is a review.',
            film: film1._id
        }, {
            rating: 5,
            reviewer: reviewer._id,
            review: 'This is another review.',
            film: film2._id
        }]);
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

    it('get the reviewer by id with GET:id', () => {
        return request(app)
            .get(`/api/v1/reviewers/${reviewer._id}`)
            .then(res => {
                expect(res.body.name).toEqual('Mike Spence');
            });
    });

    it('gets the reviewer by id and their film reviews with GET:id in correct form', () => {
        return request(app)
            .get(`/api/v1/reviewers/${reviewer._id}`)
            .then(res => {
                console.log(res.body);
                expect(res.body).toEqual({
                    _id: reviewer._id,
                    name: 'Mike Spence',
                    company: 'Living in the Theater',
                    reviews: expect.any(Array)
                });
            });
    });
    
    it('updates the reviewer with PUT', () => {
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
