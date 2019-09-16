const Router = require('../config/router')
const AuthMiddleware = require('../app/middlewares/AuthMiddleware')
const ProfileController = require('../app/Controllers/ProfileController')
const UserController = require('../app/Controllers/UserController')
const AuthController = require('../app/Controllers/AuthController')
const ArticleController = require('../app/Controllers/ArticleController')
const LoginValidator = require('../app/Validators/LoginValidator')
const ArticleValidator = require('../app/Validators/ArticleValidator')
const RegisterValidator = require('../app/Validators/RegisterValidator')
const FollowValidator = require('../app/Validators/FollowValidator')

Router.get('/', (req, res) => {
  res.json({ message: 'It works perfect!' })
})
Router.get('/users', UserController.users)
Router.post('/auth/login', LoginValidator(), AuthController.login)
Router.post('/auth/register', RegisterValidator(), AuthController.registerUser)

Router.route('/articles')
.get(ArticleController.index)
.post(AuthMiddleware.userAuth, ArticleValidator(), ArticleController.create)
Router.route('/articles/:id')
.get(ArticleController.show)
.put(AuthMiddleware.userAuth, ArticleValidator(), ArticleController.update)
.delete(AuthMiddleware.userAuth, ArticleController.delete)

Router.get('/auth/profile/articles', AuthMiddleware.userAuth, ProfileController.articles)
Router.post('/auth/profile/follow', AuthMiddleware.userAuth, FollowValidator(), ProfileController.follow)
Router.post('/auth/profile/unfollow', AuthMiddleware.userAuth, FollowValidator(), ProfileController.unfollow)
Router.get('/auth/profile/followers', AuthMiddleware.userAuth, ProfileController.followers)
Router.get('/auth/profile/followings', AuthMiddleware.userAuth, ProfileController.followings)

// Admin Routes


module.exports = Router
