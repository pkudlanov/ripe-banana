require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/Reviewer');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');
// const Review = require('../lib/models/Review');

describe('app routes', () => {
    beforeAll(() => {
        connect();
    });

    beforeEach(() => {
        return mongoose.connection.dropDatabase();
    });

    let reviewer = null;
    let studio = null;
    let actor = null;
    let film = null;
    beforeEach(async() => {
        reviewer = JSON.parse(JSON.stringify(await Reviewer.create({
            name: 'Jason Bourne',
            company: 'My I Am Good Inc.'
        })));

        studio = JSON.parse(JSON.stringify(await Studio.create({
            name: 'Please Help Studios'
        })));

        actor = JSON.parse(JSON.stringify(await Actor.create({
            name: 'Mr. Berry Streetson'
        })));

        film = JSON.parse(JSON.stringify(await Film.create({
            title: 'Slipping into Adventure',
            studio: studio._id,
            released: 2008,
            cast: [{ actor: actor._id }]
        })));
    });

    afterAll(() => {
        return mongoose.connection.close();
    });

    it('creates a new review with POST', () => {
        return request(app)
            .post('/api/v1/reviews')
            .send({
                rating: 4,
                reviewer: reviewer._id,
                review: `It was a rather raunchy film to say the least.
                    Lots of slamming doors, and popping of tires. I never
                    did nor do I now, approve of such activity. That is
                    just plain and simple unacceptable in this universe
                    or any for that matter. Don't watch the film if you
                    don't want to get mentally scared for life from all
                    the door slamming and popping of tires!`,
                film: film._id
            })
            .then(res => {
                expect(res.body).toEqual({
                    _id: expect.any(String),
                    rating: '4',
                    reviewer: reviewer._id,
                    review: `It was a rather raunchy film to say the least.
                        Lots of slamming doors, and popping of tires. I never
                        did nor do I now, approve of such activity. That is
                        just plain and simple unacceptable in this universe
                        or any for that matter. Don't watch the film if you
                        don't want to get mentally scared for life from all
                        the door slamming and popping of tires!`,
                    film: film._id,
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                    __v: 0
                });
            });
    });
});
