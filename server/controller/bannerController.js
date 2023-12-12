const Banner = require('../model/Banner')

exports.index = async (req, res) => {
  const currentPage = parseInt(req.query.page) || 1
  const limit = 2

  const totalBrands = await Banner.countDocuments()
  const totalPages = Math.ceil(totalBrands / limit)

  const banners = await Banner.find()
    .sort({ ['_id']: 'desc' })
    .skip((currentPage - 1) * limit)
    .limit(limit)

  res.render('pages/banner/index', {
    page: 'banners',
    banners,
    currentPage,
    totalPages,
    success: req.flash('success'),
    error: req.flash('error'),
  })
}

exports.create = async (req, res) => {
  res.render('pages/banner/create', { page: 'banners', error: req.flash('error') })
}

exports.store = async (req, res) => {
  const { url, status } = req.body

  const banner = new Banner({ url, status })

  banner
    .save()
    .then(() => {
      req.flash('success', 'Thêm banner thành công')
      res.redirect('/banners')
    })
    .catch(err => {
      const message = err.message || 'Có lỗi trong lúc thêm banner. Vui lòng thử lại'
      req.flash('error', message)
      res.redirect('back')
    })
}

exports.edit = async (req, res) => {
  if (!req.params.id) {
    req.flash('error', 'Không tìm thấy banner')
    res.redirect('/banners')
  }
  const id = req.params.id

  Banner.findById(id)
    .then(banner => {
      if (!banner) {
        req.flash('error', 'Không tìm thấy banner')
        res.redirect('/banners')
      } else {
        res.render('pages/banner/edit', {
          page: 'banners',
          banner,
          success: req.flash('success'),
          error: req.flash('error'),
        })
      }
    })
    .catch(err => {
      const message = err.message || 'Lỗi máy chủ'
      req.flash('error', message)
      res.redirect('/banners')
    })
}

exports.update = async (req, res) => {
  const { url, status } = req.body

  if (!req.params.id) {
    req.flash('error', 'Không tìm thấy banner')
    res.redirect('/banners')
  }
  const id = req.params.id

  Banner.findByIdAndUpdate(id, { url, status })
    .then(data => {
      if (!data) {
        req.flash('error', 'Không tìm thấy banner')
        res.redirect('/banners')
      } else {
        req.flash('success', 'Cập nhật thành công')
        res.redirect(`/banners/${id}/edit`)
      }
    })
    .catch(err => {
      const message = err.message || 'Lỗi máy chủ'
      req.flash('error', message)
      res.redirect('/banners')
    })
}
