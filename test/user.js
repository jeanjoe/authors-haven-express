const assert = require('assert')
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('./../server')
chai.should()

chai.use(chaiHttp)

// eslint-disable-next-line no-undef
describe('Basic Mocha test', () => {

    // eslint-disable-next-line no-undef
    it('Should Test for length of string', () => {
        assert.equal('Hello'.length, 5)
    })

    // eslint-disable-next-line no-undef
    it('Should fetch users', (done) => {
        chai.request(server).get('/api/users').end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('users')
            res.body.should.have.property('status').eql(1)
            done()
        })
    })

})
