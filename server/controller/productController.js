const Product = require('../model/Product')
const Category = require('../model/Category')
const Brand = require('../model/Brand')

// const products = require('./data').reverse()

// exports.index = async (req, res) => {
//   const productLength = products.length
//   const newProducts = []

//   for (i = 0; i < productLength; i++) {
//     const product = products[i]

//     let newCategory = await Category.findOne({ name: product.category })
//     if (!newCategory) {
//       newCategory = new Category({ name: product.category })
//       await newCategory.save()
//     }

//     let newBrand = await Brand.findOne({ name: product.brand })
//     if (!newBrand) {
//       newBrand = new Brand({ name: product.brand })
//       await newBrand.save()
//     }

//     newProducts.push({
//       name: product.name,
//       category: newCategory,
//       brand: newBrand,
//       price: product.price,
//       imageUrl: product.image_url,
//     })
//   }

//   Product.insertMany(newProducts).then(() => res.send(newProducts))
// }

exports.index = async (req, res) => {
  const {
    searchKey = '',
    searchCategory = '',
    searchBrand = '',
    sort = 'date',
    page = 1,
  } = req.query

  const query = {}
  if (searchKey) {
    query.name = { $regex: new RegExp(searchKey, 'i') }
  }
  if (searchCategory) {
    query['category._id'] = searchCategory
  }
  if (searchBrand) {
    query['brand._id'] = searchBrand
  }

  let sortOptions
  if (sort == 'date') {
    sortOptions = { _id: 'desc' }
  } else if (sort == 'price-desc') {
    sortOptions = { price: 'desc' }
  } else if (sort == 'price-esc') {
    sortOptions = { price: 1 }
  }

  const limit = 20
  const skip = (page - 1) * limit
  const totalProducts = await Product.countDocuments(query)
  const totalPages = Math.ceil(totalProducts / limit)

  const products = await Product.find(query).sort(sortOptions).skip(skip).limit(limit)
  const categories = await Category.find().sort({ _id: 'desc' })
  const brands = await Brand.find().sort({ _id: 'desc' })

  res.render('product/index', {
    page: 'products',
    products,
    categories,
    brands,
    searchKey,
    searchCategory,
    searchBrand,
    sort,
    currentPage: page,
    totalPages,
    success: req.flash('success'),
    error: req.flash('error'),
  })
}

// exports.create = async (req, res) => {
//   res.render('brand/create', { page: 'brands', error: req.flash('error') })
// }

// exports.store = async (req, res) => {
//   const { name, status } = req.body

//   const brand = new Brand({ name, status })

//   brand
//     .save()
//     .then(() => {
//       req.flash('success', 'Thêm thương hiệu thành công')
//       res.redirect('/brands')
//     })
//     .catch(err => {
//       const message = err.message || 'Có lỗi trong lúc thêm thương hiệu. Vui lòng thử lại'
//       req.flash('error', message)
//       res.redirect('back')
//     })
// }

// exports.edit = async (req, res) => {
//   if (!req.params.id) {
//     req.flash('error', 'Không tìm thấy thương hiệu')
//     res.redirect('/brands')
//   }
//   const id = req.params.id

//   Brand.findById(id)
//     .then(brand => {
//       if (!brand) {
//         req.flash('error', 'Không tìm thấy thương hiệu')
//         res.redirect('/brands')
//       } else {
//         res.render('brand/edit', {
//           page: 'brands',
//           brand,
//           success: req.flash('success'),
//           error: req.flash('error'),
//         })
//       }
//     })
//     .catch(err => {
//       const message = err.message || 'Lỗi máy chủ'
//       req.flash('error', message)
//       res.redirect('/brands')
//     })
// }

// exports.update = async (req, res) => {
//   const { name, status } = req.body

//   if (!req.params.id) {
//     req.flash('error', 'Không tìm thấy thương hiệu')
//     res.redirect('/brands')
//   }
//   const id = req.params.id

//   Brand.findByIdAndUpdate(id, { name, status })
//     .then(data => {
//       if (!data) {
//         req.flash('error', 'Không tìm thấy thương hiệu')
//         res.redirect('/brands')
//       } else {
//         req.flash('success', 'Cập nhật thành công')
//         res.redirect(`/brands/${id}/edit`)
//       }
//     })
//     .catch(err => {
//       const message = err.message || 'Lỗi máy chủ'
//       req.flash('error', message)
//       res.redirect('/brands')
//     })
// }
