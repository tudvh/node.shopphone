const Product = require('../model/Product')
const Category = require('../model/Category')
const Brand = require('../model/Brand')

// const products = require('./data').reverse()

// exports.index = async (req, res) => {
//   const productLength = products.length
//   const newProducts = []

//   for (i = 0; i < productLength; i++) {
//     const product = products[i]

//     let category_id = await Category.findOne({ name: product.category })
//     if (!category_id) {
//       const newCategory = new Category({ name: product.category })
//       await newCategory.save()
//       category_id = newCategory._id
//     }

//     let brand_id = await Brand.findOne({ name: product.brand })
//     if (!brand_id) {
//       const newBrand = new Brand({ name: product.brand })
//       await newBrand.save()
//       brand_id = newBrand._id
//     }

//     newProducts.push({
//       name: product.name,
//       category: category_id,
//       brand: brand_id,
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
    query['category'] = searchCategory
  }
  if (searchBrand) {
    query['brand'] = searchBrand
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

  const [products, categories, brands] = await Promise.all([
    Product.find(query)
      .sort(sortOptions)
      .populate('category')
      .populate('brand')
      .skip(skip)
      .limit(limit),
    Category.find().sort({ _id: 'desc' }),
    Brand.find().sort({ _id: 'desc' }),
  ])

  res.render('pages/product/index', {
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

exports.create = async (req, res) => {
  const [categories, brands] = await Promise.all([
    Category.find({ status: true }).sort({ _id: 'desc' }),
    Brand.find({ status: true }).sort({ _id: 'desc' }),
  ])

  res.render('pages/product/create', {
    page: 'products',
    categories,
    brands,
    error: req.flash('error'),
  })
}

exports.store = async (req, res) => {
  const { name, categoryId, brandId, price, imageUrls, status } = req.body

  const product = new Product({
    name,
    category: categoryId,
    brand: brandId,
    price,
    imageUrl: imageUrls.map(url => url.trim()).filter(url => url),
    status,
  })

  product
    .save()
    .then(() => {
      req.flash('success', 'Thêm sản phẩm thành công')
      res.redirect('/products')
    })
    .catch(err => {
      const message = err.message || 'Có lỗi trong lúc thêm sản phẩm. Vui lòng thử lại'
      req.flash('error', message)
      res.redirect('back')
    })
}

exports.edit = async (req, res) => {
  if (!req.params.id) {
    req.flash('error', 'Không tìm thấy sản phẩm')
    res.redirect('/brands')
  }
  const id = req.params.id

  try {
    const [product, categories, brands] = await Promise.all([
      Product.findById(id),
      Category.find({ status: true }).sort({ _id: 'desc' }),
      Brand.find({ status: true }).sort({ _id: 'desc' }),
    ])

    if (!product) {
      req.flash('error', 'Không tìm thấy sản phẩm')
      res.redirect('/products')
    } else {
      res.render('pages/product/edit', {
        page: 'products',
        product,
        categories,
        brands,
        success: req.flash('success'),
        error: req.flash('error'),
      })
    }
  } catch {
    const message = err.message || 'Lỗi máy chủ'
    req.flash('error', message)
    res.redirect('/products')
  }
}

exports.update = async (req, res) => {
  const { name, categoryId, brandId, price, imageUrls, status } = req.body

  if (!req.params.id) {
    req.flash('error', 'Không tìm thấy sản phẩm')
    res.redirect('/products')
  }
  const id = req.params.id

  Product.findByIdAndUpdate(id, {
    name,
    category: categoryId,
    brand: brandId,
    price,
    imageUrl: imageUrls.map(url => url.trim()).filter(url => url),
    status,
  })
    .then(data => {
      if (!data) {
        req.flash('error', 'Không tìm thấy sản phẩm')
        res.redirect('/products')
      } else {
        req.flash('success', 'Cập nhật thành công')
        res.redirect(`/products/${id}/edit`)
      }
    })
    .catch(err => {
      const message = err.message || 'Lỗi máy chủ'
      req.flash('error', message)
      res.redirect('/products')
    })
}
