let mongoose = require("mongoose");
const db = require("../app/models");
const ReviewModel = db.reviews;

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();
const assert = require('assert');
const config = require("../app/config/db.config");


chai.use(chaiHttp);

describe('----------Config Test-----------', ()=>{
    describe('test for All congig variables are defined properly', function () {
      it('It should test mongodb config ', (done)  => {
        config.url.should.be.eql("mongodb://localhost:27017/reviewDb");
        done();
      });
    });
  });

describe('Reviews', () => {
        ReviewModel.remove({product_name: "unit test"}, (err) => {
           console.log('clear db with unit test documents')
        });
   //  });
    describe('/GET reviews', () => {
        it('it should not POST a reviews without rating', (done) => {
            let reviews = [
                {
                    "review": "Pero deberia de poder cambiarle el idioma a alexa",
                    "author": "WarcryxD",
                    "review_source": "iTunes",
                    "rating": '',
                    "title": "Excelente",
                    "product_name": "unit test",
                    "reviewed_date": "2018-01-12T02:27:03.000Z"
                }
            ]
            chai.request(server)
                .post('/api/reviews')
                .send(reviews)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.success.should.be.eql(false);
                    res.body.should.have.property('message');
                    res.body.should.have.property('invalidRequests');
                    res.body.invalidRequests.should.be.a('array');
                    res.body.invalidRequests.should.be.length(1);
                    done();
                });
        });

        it('it should  POST  reviews', (done) => {
            let reviews = [
                {
                    "review": "Pero deberia de poder cambiarle el idioma a alexa",
                    "author": "WarcryxD",
                    "review_source": "iTunes",
                    "rating": 4,
                    "title": "Excelente",
                    "product_name": "unit test",
                    "reviewed_date": "2018-01-12T02:27:03.000Z"
                },
                {
                    "review": "Cannot fix connection glitches without this-also fix connection glitches \n\nSmart things sees my light and Alexa doesn’t :(\n\n*update new devices “unresponsive” each day...they are working fine in SmartThings. No way to delete disabled devices. Very poor.",
                    "author": "Ranchorat",
                    "review_source": "iTunes",
                    "rating": 1,
                    "title": "Need to be able to delete devices",
                    "product_name": "unit test",
                    "reviewed_date": "2017-12-06T13:06:33.000Z"
                },
                {
                    "review": "After typing in the log in screen and submit, jump back to the login screen.",
                    "author": "omgzero",
                    "review_source": "iTunes",
                    "rating": 1,
                    "title": "Can’t log it",
                    "product_name": "unit test",
                    "reviewed_date": "2017-12-06T14:48:03.000Z"
                }
            ]
            chai.request(server)
                .post('/api/reviews')
                .send(reviews)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success');
                    res.body.success.should.be.true;
                    res.body.should.have.property('data');
                    res.body.data.should.be.a('array');
                    res.body.data.should.be.length(3);
                    done();
                });
        });

        it('it should GET all the reviews', (done) => {
            chai.request(server)
                .get('/api/reviews?productName=unit test')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.be.true;
                    res.body.data.should.be.a('array');
                    res.body.data.should.be.length(3);
                    done();
                });
        });

        it('it should GET monthly rating per product', (done) => {
            chai.request(server)
                .get('/api/reviews/monthlyRating?productName=unit test')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.be.true;
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('unit test');
                    res.body.data['unit test'].should.have.property('2018');
                    res.body.data['unit test']['2018'].should.have.property('1');
                    res.body.data['unit test']['2018']['1'].should.be.eql('4.00');

                    done();
                });
        });

        it('it should GET total rating per product', (done) => {
            chai.request(server)
                .get('/api/reviews/totalRating?productName=unit test')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.be.true;
                    res.body.should.have.property('data');
                    res.body.data.should.have.property('unit test');
                    res.body.data['unit test'].should.have.property('Rating 4');
                    res.body.data['unit test']['Rating 4'].should.be.eql(1);

                    done();
                });
        });

        it('it should clear reviews added in unit test from db', (done) => {
            ReviewModel.remove({product_name: "unit test"}, (err) => {
                chai.request(server)
                .get('/api/reviews?productName=unit test')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.success.should.be.true;
                    res.body.data.should.be.a('array');
                    res.body.data.should.be.length(0);
                    done();
                });
             });

            
        });
    });
});