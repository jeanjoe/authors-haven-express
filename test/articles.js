const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('./../server')
const User = require('../app/Models/User')
const Article = require('../app/Models/Article')
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

const article = {
    title: 'Testing article',
    description: 'Article Tester',
    body: 'Article test body',
    tags: ['test', 'articles']
}

const updateArticle = {
    title: 'Testing article',
    description: 'Article Tester',
    body: 'Article test body',
    tags: ['test', 'articles']
}
const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImFjY291bnRfdHlwZSI6ImF1dGhvciIsIl9pZCI6IjVkMzZmZWRhODFjNzI4MDUyNzE4Y2VkOCIsInVzZXJuYW1lIjoiTWFuemVkZSIsImVtYWlsIjoibWFuemVkZUBnbWFpbC5jb20iLCJjcmVhdGVkQXQiOiIyMDE5LTA3LTIzVDEyOjM0OjM0LjQxOVoiLCJ1cGRhdGVkQXQiOiIyMDE5LTA3LTIzVDEyOjM0OjM0LjQxOVoiLCJfX3YiOjB9LCJpYXQiOjE1NjQ0OTM3ODYsImV4cCI6MTU2NDQ5NDA4Nn0.BatEoBSaX7Wb4agzddMsiMVZY6bZ0jXDb0kXjmSSs-Q'

// eslint-disable-next-line no-undef
describe('Basic Mocha test', () => {

    // eslint-disable-next-line no-undef
    before(() => {
        process.env.NODE_ENV = 'test'
        User.deleteMany({}, () => { })
        Article.deleteMany({}, () => { })
    })

    // eslint-disable-next-line no-undef
    afterEach(() => {
        User.deleteMany({}, () => { })
        Article.deleteMany({}, () => { })
    })

    // eslint-disable-next-line no-undef
    it('Should fetch articles', (done) => {
        chai.request(server).get('/api/articles').end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('articles')
            res.body.should.have.property('status').eql(1)
            res.body.should.have.property('message').eql('Articles retrieved successfully')
            done()
        })
    })

    // eslint-disable-next-line no-undef
    it('Should show article not found error', (done) => {
        chai.request(server).get('/api/articles/not-found').end((err, res) => {
            res.should.have.status(404);
            res.body.should.have.property('status').eql(0)
            res.body.should.have.property('message').eql('Article not Found')
            done()
        })
    })

    // eslint-disable-next-line no-undef
    it('Should post article on unauthenticated account', (done) => {
        chai.request(server).post('/api/articles').send().end((err, res) => {
            res.should.have.status(403)
            done()
        })
    })

    // eslint-disable-next-line no-undef
    it('Should post article on authenticated account with Validation errors', (done) => {
        chai.request(server).post('/api/auth/register').send(registerUser).end(() => {
            chai.request(server).post('/api/auth/login').send(userLogin).end((err, res) => {
                const token = res.body.token
                chai.request(server).post('/api/articles').send().set('Authorization', `Bearer ${token}`).end((err, res) => {
                    res.should.have.status(422)
                    res.body.should.have.property('message').eql('Validation Error')
                    res.body.should.have.property('errors')
                    done()
                })
            })
        })
    })

    // eslint-disable-next-line no-undef
    it('Should post article on authenticated account', (done) => {
        const article = {
            title: 'Testing article',
            description: 'Article Tester',
            body: 'Article test body',
            tags: ['test', 'articles']
        }

        chai.request(server).post('/api/auth/register').send(registerUser).end(() => {
            chai.request(server).post('/api/auth/login').send(userLogin).end((err, res) => {
                const token = res.body.token
                chai.request(server).post('/api/articles').send(article).set('Authorization', `Bearer ${token}`).end((err, res) => {
                    res.should.have.status(201)
                    res.body.should.have.property('message').eql('Article created successfully')
                    res.body.should.have.property('article')
                    done()
                })
            })
        })
    })


    // eslint-disable-next-line no-undef
    it('Should show an article', (done) => {
        chai.request(server).post('/api/auth/register').send(registerUser).end(() => {
            chai.request(server).post('/api/auth/login').send(userLogin).end((err, res) => {
                const token = res.body.token
                chai.request(server).post('/api/articles').send(article).set('Authorization', `Bearer ${token}`).end((err, res) => {
                    console.log('Article ID', res.body.article._id)
                    chai.request(server).get('/api/articles/' + res.body.article._id).end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.have.property('message').eql('Article retrieved successfully')
                        res.body.should.have.property('article')
                        done()
                    })
                })
            })
        })
    })

    // eslint-disable-next-line no-undef
    it('Should not update an article for unauthenticated user', (done) => {
        chai.request(server).post('/api/auth/register').send(registerUser).end(() => {
            chai.request(server).post('/api/auth/login').send(userLogin).end((err, res) => {
                const token = res.body.token
                chai.request(server).post('/api/articles').send(article).set('Authorization', `Bearer ${token}`).end((err, res) => {
                    chai.request(server).put('/api/articles/' + res.body.article._id).end((err, res) => {
                        res.should.have.status(403)
                        res.body.should.have.property('message').eql('Authorization required')
                        done()
                    })
                })
            })
        })
    })

    // eslint-disable-next-line no-undef
    it('Should not update an article on error', (done) => {
        chai.request(server).post('/api/auth/register').send(registerUser).end(() => {
            chai.request(server).post('/api/auth/login').send(userLogin).end((err, res) => {
                const token = res.body.token
                chai.request(server).post('/api/articles').send(article).set('Authorization', `Bearer ${token}`).end((err, res) => {
                    chai.request(server).put('/api/articles/' + res.body.article._id).set('Authorization', `Bearer ${token}`).end((err, res) => {
                        res.should.have.status(422)
                        res.body.should.have.property('message').eql('Validation Error')
                        res.body.should.have.property('errors')
                        done()
                    })
                })
            })
        })
    })

    // eslint-disable-next-line no-undef
    it('Should update an article for authenticated', (done) => {
        chai.request(server).post('/api/auth/register').send(registerUser).end(() => {
            chai.request(server).post('/api/auth/login').send(userLogin).end((err, res) => {
                const token = res.body.token
                chai.request(server).post('/api/articles').send(article).set('Authorization', `Bearer ${token}`).end((err, res) => {
                    chai.request(server).put('/api/articles/' + res.body.article._id).send(updateArticle).set('Authorization', `Bearer ${token}`).end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.have.property('message').eql('Article updated successfully')
                        res.body.should.have.property('article')
                        done()
                    })
                })
            })
        })
    })

    // eslint-disable-next-line no-undef
    it('Should not update an article not found for authenticated', (done) => {
        chai.request(server).post('/api/auth/register').send(registerUser).end(() => {
            chai.request(server).post('/api/auth/login').send(userLogin).end((err, res) => {
                const token = res.body.token
                chai.request(server).post('/api/articles').send(article).set('Authorization', `Bearer ${token}`).end(() => {
                    chai.request(server).put('/api/articles/not-found').send(updateArticle).set('Authorization', `Bearer ${token}`).end((err, res) => {
                        res.should.have.status(404)
                        res.body.should.have.property('message').eql('Article not Found')
                        res.body.should.have.property('error')
                        done()
                    })
                })
            })
        })
    })

    // eslint-disable-next-line no-undef
    it('Should not update an article on invalid token', (done) => {
        chai.request(server).post('/api/auth/register').send(registerUser).end(() => {
            chai.request(server).post('/api/auth/login').send(userLogin).end((err, res) => {
                const token = res.body.token
                chai.request(server).post('/api/articles').send(article).set('Authorization', `Bearer ${token}`).end((err, res) => {
                    chai.request(server).put('/api/articles/' + res.body.article._id).send(updateArticle).set('Authorization', `Bearer ${invalidToken}`).end((err, res) => {
                        res.should.have.status(401)
                        res.body.should.have.property('message').eql('Authorization Error')
                        res.body.should.have.property('error')
                        done()
                    })
                })
            })
        })
    })

    // eslint-disable-next-line no-undef
    it('Should not update an article on token without bearer', (done) => {
        chai.request(server).post('/api/auth/register').send(registerUser).end(() => {
            chai.request(server).post('/api/auth/login').send(userLogin).end((err, res) => {
                const token = res.body.token
                chai.request(server).post('/api/articles').send(article).set('Authorization', `Bearer ${token}`).end((err, res) => {
                    chai.request(server).put('/api/articles/' + res.body.article._id).send(updateArticle).set('Authorization', `${token}`).end((err, res) => {
                        res.should.have.status(403)
                        res.body.should.have.property('message').eql('Authorization Error')
                        res.body.should.have.property('error')
                        done()
                    })
                })
            })
        })
    })

    // eslint-disable-next-line no-undef
    it('Should delete an article for authenticated', (done) => {
        chai.request(server).post('/api/auth/register').send(registerUser).end(() => {
            chai.request(server).post('/api/auth/login').send(userLogin).end((err, res) => {
                const token = res.body.token
                chai.request(server).post('/api/articles').send(article).set('Authorization', `Bearer ${token}`).end((err, res) => {
                    chai.request(server).delete('/api/articles/' + res.body.article._id).set('Authorization', `Bearer ${token}`).end((err, res) => {
                        res.should.have.status(200)
                        res.body.should.have.property('message').eql('Article deleted successfully')
                        done()
                    })
                })
            })
        })
    })

    // eslint-disable-next-line no-undef
    it('Should throw error on delete an article not found for authenticated', (done) => {
        chai.request(server).post('/api/auth/register').send(registerUser).end(() => {
            chai.request(server).post('/api/auth/login').send(userLogin).end((err, res) => {
                const token = res.body.token
                chai.request(server).post('/api/articles').send(article).set('Authorization', `Bearer ${token}`).end(() => {
                    chai.request(server).delete('/api/articles/not-found').set('Authorization', `Bearer ${token}`).end((err, res) => {
                        res.should.have.status(404)
                        res.body.should.have.property('message').eql('Article Not Found')
                        done()
                    })
                })
            })
        })
    })
})
