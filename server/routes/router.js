const express = require('express')
const route = express.Router()

const authMiddleware = require('../middleware/authMiddleware')

const homeController = require('../controller/homeController')
const authController = require('../controller/authController')
const bannerController = require('../controller/bannerController')
const categoryController = require('../controller/categoryController')
const brandController = require('../controller/brandController')
const productController = require('../controller/productController')
const customerController = require('../controller/customerController')

route.get('/', authMiddleware, homeController.home)

// Auth
route.get('/login', authController.login)
route.post('/login', authController.handleLogin)
route.get('/logout', authController.logout)
route.get('/personal', authMiddleware, authController.personal)
route.post('/personal', authMiddleware, authController.updatePersonal)
route.post('/change-password', authMiddleware, authController.changePassword)

// Banner
route.get('/banners', authMiddleware, bannerController.index)
route.get('/banners/create', authMiddleware, bannerController.create)
route.post('/banners/create', authMiddleware, bannerController.store)
route.get('/banners/:id/edit', authMiddleware, bannerController.edit)
route.post('/banners/:id/edit', authMiddleware, bannerController.update)

// Category
route.get('/categories', authMiddleware, categoryController.index)
route.get('/categories/create', authMiddleware, categoryController.create)
route.post('/categories/create', authMiddleware, categoryController.store)
route.get('/categories/:id/edit', authMiddleware, categoryController.edit)
route.post('/categories/:id/edit', authMiddleware, categoryController.update)

// Brand
route.get('/brands', authMiddleware, brandController.index)
route.get('/brands/create', authMiddleware, brandController.create)
route.post('/brands/create', authMiddleware, brandController.store)
route.get('/brands/:id/edit', authMiddleware, brandController.edit)
route.post('/brands/:id/edit', authMiddleware, brandController.update)

// Product
route.get('/products', authMiddleware, productController.index)
route.get('/products/create', authMiddleware, productController.create)
route.post('/products/create', authMiddleware, productController.store)
route.get('/products/:id/edit', authMiddleware, productController.edit)
route.post('/products/:id/edit', authMiddleware, productController.update)

// Customer
route.get('/customers', authMiddleware, customerController.index)
route.post('/customers/:id/look', authMiddleware, customerController.look)
route.post('/customers/:id/un-look', authMiddleware, customerController.unLook)

module.exports = route
