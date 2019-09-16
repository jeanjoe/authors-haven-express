const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('./../server')
const User = require('../app/Models/User')
const Article = require('../app/Models/Article')
const Follower = require('../app/Models/Follower')
chai.should()

chai.use(chaiHttp)
const registerUser = {
    username: 'Test user',
    email: 'testuser@test.com',
    password: 'tester@123'
}
const registerUser2 = {
    username: 'Test user2',
    email: 'testuser2@test.com',
    password: 'tester2@123'
}
const userLogin = {
    email: 'testuser@test.com',
    password: 'tester@123'
}

const article = {
    title: 'Testing article',
    description: 'Article Tester',
    body: 'Article test body',
    tags: ['test', 'articles']
}

// eslint-disable-next-line no-undef
describe('Test ProfileController', () => {

    // eslint-disable-next-line no-undef
    before(() => {
        process.env.NODE_ENV = 'test'
        User.deleteMany({}, () => { })
        Article.deleteMany({}, () => { })
        Follower.deleteMany({}, () => { })
    })

    // eslint-disable-next-line no-undef
    afterEach(() => {
        User.deleteMany({}, () => { })
        Article.deleteMany({}, () => { })
        Follower.deleteMany({}, () => { })
    })

    // eslint-disable-next-line no-undef
    it('Should fetch user articles', (done) => {
        chai.request(server).post('/api/auth/register').send(registerUser).end(() => {
            chai.request(server).post('/api/auth/login').send(userLogin).end((err, res) => {
                const token = res.body.token
                chai.request(server).get('/api/auth/profile/articles').set('Authorization', `Bearer ${token}`).end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.have.property('message').eql('Articles retrieved successfully')
                    res.body.should.have.property('articles')
                    done()
                })
            })
        })
    })

    // eslint-disable-next-line no-undef
    it('Should post and fetch user articles', (done) => {
        chai.request(server).post('/api/auth/register').send(registerUser).end(() => {
            chai.request(server).post('/api/auth/login').send(userLogin).end((err, res) => {
                const token = res.body.token
                chai.request(server).post('/api/articles').send(article).set('Authorization', `Bearer ${token}`).end(() => {
                    chai.request(server).get('/api/auth/profile/articles').set('Authorization', `Bearer ${token}`).end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.have.property('message').eql('Articles retrieved successfully')
                        res.body.should.have.property('articles')
                        done()
                    })
                })
            })
        })
    })

    // eslint-disable-next-line no-undef
    it('Should fetch user followers', (done) => {
        chai.request(server).post('/api/auth/register').send(registerUser).end(() => {
            chai.request(server).post('/api/auth/login').send(userLogin).end((err, res) => {
                const token = res.body.token
                chai.request(server).get('/api/auth/profile/followers').set('Authorization', `Bearer ${token}`).end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.have.property('message').eql('Followers retrieved successfully')
                    res.body.should.have.property('followers')
                    done()
                })
            })
        })
    })

    // eslint-disable-next-line no-undef
    it('Should fetch user followers', (done) => {
        chai.request(server).post('/api/auth/register').send(registerUser).end(() => {
            chai.request(server).post('/api/auth/login').send(userLogin).end((err, res) => {
                const token = res.body.token
                chai.request(server).get('/api/auth/profile/followings').set('Authorization', `Bearer ${token}`).end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.have.property('message').eql('Followings retrieved successfully')
                    res.body.should.have.property('followings')
                    done()
                })
            })
        })
    })

    // eslint-disable-next-line no-undef
    it('Should not follow a user on Validation Error', (done) => {
        chai.request(server).post('/api/auth/register').send(registerUser).end(() => {
            chai.request(server).post('/api/auth/login').send(userLogin).end((err, res) => {
                const token = res.body.token
                chai.request(server).post('/api/auth/profile/follow').set('Authorization', `Bearer ${token}`).end((err, res) => {
                    res.should.have.status(422)
                    res.body.should.have.property('message').eql('Validation Error')
                    res.body.should.have.property('errors')
                    done()
                })
            })
        })
    })

    // eslint-disable-next-line no-undef
    it('Should not follow a user on invalid follow_id', (done) => {
        chai.request(server).post('/api/auth/register').send(registerUser).end(() => {
            chai.request(server).post('/api/auth/login').send(userLogin).end((err, res) => {
                const token = res.body.token
                chai.request(server).post('/api/auth/profile/follow').send({ follow_id: '1234567890' }).set('Authorization', `Bearer ${token}`).end((err, res) => {
                    res.should.have.status(404)
                    res.body.should.have.property('message').eql('User Follow Error')
                    res.body.should.have.property('error')
                    done()
                })
            })
        })
    })

    // eslint-disable-next-line no-undef
    it('Should follow a user on valid follow_id', (done) => {
        chai.request(server).post('/api/auth/register').send(registerUser).end(() => {
            chai.request(server).post('/api/auth/login').send(userLogin).end((err, res) => {
                const token = res.body.token
                chai.request(server).post('/api/auth/register').send(registerUser2).end((err, data) => {
                    chai.request(server).post('/api/auth/profile/follow').send({ follow_id: data.body.user._id }).set('Authorization', `Bearer ${token}`).end((err, res) => {
                        res.should.have.status(201)
                        res.body.should.have.property('message').eql('User followed successfully')
                        res.body.should.have.property('follow')
                        done()
                    })
                })
            })
        })
    })

})
