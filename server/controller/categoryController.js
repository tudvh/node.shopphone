const Category = require('../model/Category')

exports.index = async (req, res) => {
  const currentPage = parseInt(req.query.page) || 1
  const limit = 2

  const totalCategories = await Category.countDocuments()
  const totalPages = Math.ceil(totalCategories / limit)

  const categories = await Category.find()
    .sort({ ['_id']: 'desc' })
    .skip((currentPage - 1) * limit)
    .limit(limit)

  res.render('pages/category/index', {
    page: 'categories',
    categories,
    currentPage,
    totalPages,
    success: req.flash('success'),
    error: req.flash('error'),
  })
}

exports.create = async (req, res) => {
  res.render('pages/category/create', { page: 'categories', error: req.flash('error') })
}

exports.store = async (req, res) => {
  const { name, status } = req.body

  const category = new Category({ name, status })

  category
    .save()
    .then(() => {
      req.flash('success', 'Thêm danh mục thành công')
      res.redirect('/categories')
    })
    .catch(err => {
      const message = err.message || 'Có lỗi trong lúc thêm danh mục. Vui lòng thử lại'
      req.flash('error', message)
      res.redirect('back')
    })
}

exports.edit = async (req, res) => {
  if (!req.params.id) {
    req.flash('error', 'Không tìm thấy danh mục')
    res.redirect('/categories')
  }
  const id = req.params.id

  Category.findById(id)
    .then(category => {
      if (!category) {
        req.flash('error', 'Không tìm thấy danh mục')
        res.redirect('/categories')
      } else {
        res.render('pages/category/edit', {
          page: 'categories',
          category,
          success: req.flash('success'),
          error: req.flash('error'),
        })
      }
    })
    .catch(err => {
      const message = err.message || 'Lỗi máy chủ'
      req.flash('error', message)
      res.redirect('/categories')
    })
}

exports.update = async (req, res) => {
  const { name, status } = req.body

  if (!req.params.id) {
    req.flash('error', 'Không tìm thấy danh mục')
    res.redirect('/categories')
  }
  const id = req.params.id

  Category.findByIdAndUpdate(id, { name, status })
    .then(data => {
      if (!data) {
        req.flash('error', 'Không tìm thấy danh mục')
        res.redirect('/categories')
      } else {
        req.flash('success', 'Cập nhật thành công')
        res.redirect(`/categories/${id}/edit`)
      }
    })
    .catch(err => {
      const message = err.message || 'Lỗi máy chủ'
      req.flash('error', message)
      res.redirect('/categories')
    })
}
