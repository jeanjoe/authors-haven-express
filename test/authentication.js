const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('./../server')
const User = require('../app/Models/User')
chai.should()

chai.use(chaiHttp)

const registerUser = {
    username: 'Test user',
    email: 'testuser@test.com',
    password: 'tester@123'
}
const userLogin = {
    email: 'testuser@test.com',
    password: 'tester@123'
}
const wrongLogin = {
    email: 'wrongemail@test.com',
    password: 'tester@123'
}

// eslint-disable-next-line no-undef
describe('Basic Mocha test', () => {

    // eslint-disable-next-line no-undef
    before(() => {
        process.env.NODE_ENV = 'test'
        User.deleteMany({}, () => { })
    })

    // eslint-disable-next-line no-undef
    afterEach(() => {
        User.deleteMany({}, () => { })
    })

    // eslint-disable-next-line no-undef
    it('Should return validation on create users', (done) => {
        chai.request(server).post('/api/auth/register').end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('errors')
            res.body.should.have.property('status').eql(0)
            res.body.should.have.property('message').eql('Validation Error')
            done()
        })
    })

    // eslint-disable-next-line no-undef
    it('Should create new user', (done) => {
        chai.request(server).post('/api/auth/register').send(registerUser).end((err, res) => {
            res.should.have.status(201);
            res.body.should.have.property('user')
            res.body.should.have.property('status').eql(1)
            res.body.should.have.property('message').eql('User account has been created successfully')
            done()
        })
    })

    // eslint-disable-next-line no-undef
    it('Should check duplicate email for new user', (done) => {
        chai.request(server).post('/api/auth/register').send(registerUser).end(() => {
            chai.request(server).post('/api/auth/register').send(registerUser).end((err, res) => {
                res.should.have.status(422);
                res.body.should.have.property('status').eql(0)
                res.body.should.have.property('message').eql('This Email address is already registered!')
                done()
            })
        })
    })

    // eslint-disable-next-line no-undef
    it('Should return validation on user login', (done) => {
        chai.request(server).post('/api/auth/login').end((err, res) => {
            res.should.have.status(422);
            res.body.should.have.property('errors')
            res.body.should.have.property('status').eql(0)
            res.body.should.have.property('message').eql('Validation Error')
            done()
        })
    })

    // eslint-disable-next-line no-undef
    it('Should Login user', (done) => {
        chai.request(server).post('/api/auth/register').send(registerUser).end(() => {
            chai.request(server).post('/api/auth/login').send(userLogin).end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('user')
                res.body.should.have.property('status').eql(1)
                res.body.should.have.property('message').eql('Login Successfull.')
                done()
            })
        })
    })

    // eslint-disable-next-line no-undef
    it('Should return wrong user credential message', (done) => {
        chai.request(server).post('/api/auth/register').send(registerUser).end(() => {
            chai.request(server).post('/api/auth/login').send(wrongLogin).end((err, res) => {
                res.should.have.status(400);
                res.body.should.have.property('status').eql(0)
                res.body.should.have.property('message').eql('Wrong email or password')
                done()
            })
        })
    })
})
