const Brand = require('../model/Brand')

exports.index = async (req, res) => {
  const currentPage = parseInt(req.query.page) || 1
  const limit = 5

  const totalBrands = await Brand.countDocuments()
  const totalPages = Math.ceil(totalBrands / limit)

  const brands = await Brand.find()
    .sort({ ['_id']: 'desc' })
    .skip((currentPage - 1) * limit)
    .limit(limit)

  res.render('pages/brand/index', {
    page: 'brands',
    brands,
    currentPage,
    totalPages,
    success: req.flash('success'),
    error: req.flash('error'),
  })
}

exports.create = async (req, res) => {
  res.render('pages/brand/create', { page: 'brands', error: req.flash('error') })
}

exports.store = async (req, res) => {
  const { name, status } = req.body

  const brand = new Brand({ name, status })

  brand
    .save()
    .then(() => {
      req.flash('success', 'Thêm thương hiệu thành công')
      res.redirect('/brands')
    })
    .catch(err => {
      const message = err.message || 'Có lỗi trong lúc thêm thương hiệu. Vui lòng thử lại'
      req.flash('error', message)
      res.redirect('back')
    })
}

exports.edit = async (req, res) => {
  if (!req.params.id) {
    req.flash('error', 'Không tìm thấy thương hiệu')
    res.redirect('/brands')
  }
  const id = req.params.id

  Brand.findById(id)
    .then(brand => {
      if (!brand) {
        req.flash('error', 'Không tìm thấy thương hiệu')
        res.redirect('/brands')
      } else {
        res.render('pages/brand/edit', {
          page: 'brands',
          brand,
          success: req.flash('success'),
          error: req.flash('error'),
        })
      }
    })
    .catch(err => {
      const message = err.message || 'Lỗi máy chủ'
      req.flash('error', message)
      res.redirect('/brands')
    })
}

exports.update = async (req, res) => {
  const { name, status } = req.body

  if (!req.params.id) {
    req.flash('error', 'Không tìm thấy thương hiệu')
    res.redirect('/brands')
  }
  const id = req.params.id

  Brand.findByIdAndUpdate(id, { name, status })
    .then(data => {
      if (!data) {
        req.flash('error', 'Không tìm thấy thương hiệu')
        res.redirect('/brands')
      } else {
        req.flash('success', 'Cập nhật thành công')
        res.redirect(`/brands/${id}/edit`)
      }
    })
    .catch(err => {
      const message = err.message || 'Lỗi máy chủ'
      req.flash('error', message)
      res.redirect('/brands')
    })
}
