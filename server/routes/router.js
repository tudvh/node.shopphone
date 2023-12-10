const express = require('express')
const route = express.Router()

const authMiddleware = require('../middleware/authMiddleware')

const homeController = require('../controller/homeController')
const bannerController = require('../controller/bannerController')
const authController = require('../controller/authController')

route.get('/', authMiddleware, homeController.home)

route.get('/login', authController.login)
route.post('/login', authController.handleLogin)
route.get('/logout', authController.logout)
route.get('/personal', authMiddleware, authController.personal)
route.post('/personal', authMiddleware, authController.updatePersonal)
route.post('/change-password', authMiddleware, authController.changePassword)

route.get('/banners', authMiddleware, bannerController.index)

module.exports = route
