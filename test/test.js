var assert = require('assert');
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const config = require("../app/config/db.config");
const controller = require("../app/controllers/review.controller");
const helper = require("../app/helpers/review.helper");
// var chaiHttp = require('chai-http');
var spies = require('chai-spies');
var chaiHttp = require('chai-http');
chai.use(spies);
chai.use(chaiHttp);

request = require('request');
//config test
describe('----------Config Test-----------', function () {
  describe('test for All congig variables are defined properly', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(config.url, "mongodb://localhost:27017/reviewDb");
    });
  });
});


describe("----------Fetch Review Details Test--------------", function () {
  it("should return review Details", function () {
    let req = {
      query: {
        date: sinon.spy().date,
        rating: sinon.spy(),
        productName: sinon.spy()
      }
    }
    // Have `res` have a send key with a function value coz we use `res.send()` in our func
    let res = {
      send: sinon.spy()
    }
    controller.fetchReviews(req, res);
    // let's see what we get on res.send
  });
});

// helper 
describe('-------------Helper method test---------------', function () {
  describe('Check of error handling ', function () {
    it('should return -1 when the value is not present', function () {
      let input = {}
      let temp = helper.isInvidPayload(input);
      assert.equal(temp, 'Missing "review" property');
    });
  });
});

// routes
describe("------------Routes----------", function () {
  describe("GET Details Test", function () {

    it("should respond", function () {
      var req, res, spy;
      req = res = { query: sinon.spy() };
      spy = res.send = sinon.spy();

      controller.getAverageMonthlyRating(req, res);
      expect(spy.alwaysReturned()).to.equal(false);
    });
  });
});

describe('------------API GET Test---------------', function () {
  var server;
  before(function () {
    server = sinon.fakeServer.create();
  });
  after(function () {
    server.restore();
  });

  var url = 'http://localhost:3000';
  it('Get review System details', function (done) {
    server.respondWith('GET', url + '/totalRating', JSON.stringify({ 'totalRating': 'this works' }));
    chai.request(url)
      .get('/totalRating')
      .end(function (err, res) {
        if (err) {
          throw err;
        }
        res.should.have.status(200);
        res.body.should.have.property('test');
        console.log(res.body);

        done();
      });
  });
});
