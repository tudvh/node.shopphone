const bcrypt = require('bcrypt')
const User = require('../model/User')

exports.login = (req, res) => {
  res.render('pages/auth/login', { error: req.flash('error') })
}

exports.handleLogin = async (req, res) => {
  const { username, password } = req.body

  const user = await User.findOne({ username })

  if (!user) {
    req.flash('error', 'Tên đăng nhập hoặc mật khẩu không chính xác')
    res.redirect('back')
    return
  }

  const passwordMatch = await bcrypt.compare(password, user.password)

  if (!passwordMatch) {
    req.flash('error', 'Tên đăng nhập hoặc mật khẩu không chính xác')
    res.redirect('back')
    return
  }

  req.session.user = { id: user._id, fullName: user.fullName, avatar: user.avatar }
  return res.redirect('/')
}

exports.personal = async (req, res) => {
  const user = await User.findOne({ _id: req.session.user.id })
  res.render('pages/auth/personal', {
    user,
    errorPersonal: req.flash('errorPersonal'),
    successPersonal: req.flash('successPersonal'),
    errorPassword: req.flash('errorPassword'),
    successPassword: req.flash('successPassword'),
  })
}

exports.updatePersonal = async (req, res) => {
  const { fullName, email } = req.body

  const newUser = await User.findByIdAndUpdate(
    req.session.user.id,
    { fullName, email },
    { returnDocument: 'after' },
  )

  if (!newUser) {
    req.flash('errorPersonal', 'Có lỗi trong lúc cập nhật thông tin. Vui lòng thử lại')
  } else {
    req.flash('successPersonal', 'Cập nhật thông tin thành công')
    req.session.user = { id: newUser._id, fullName: newUser.fullName, avatar: newUser.avatar }
  }

  res.redirect('back')
}

exports.changePassword = async (req, res) => {
  const { passwordOld, passwordNew, passwordNewConfirm } = req.body

  if (passwordNew != passwordNewConfirm) {
    req.flash('errorPassword', 'Mật khẩu xác nhận phải trùng với mật khẩu')
    res.redirect('back')
    return
  }

  const user = await User.findOne({ _id: req.session.user.id })

  if (!(await bcrypt.compare(passwordOld, user.password))) {
    req.flash('errorPassword', 'Mật khẩu cũ không đúng')
    res.redirect('back')
    return
  }

  const newUser = await User.findByIdAndUpdate(req.session.user.id, {
    password: await bcrypt.hash(passwordNew, 10),
  })

  if (!newUser) {
    req.flash('errorPassword', 'Có lỗi trong lúc đổi mật khẩu. Vui lòng thử lại')
  } else {
    req.flash('successPassword', 'Đổi mật khẩu thành công')
  }

  res.redirect('back')
}

exports.logout = (req, res) => {
  delete req.session.userId
  res.redirect('/login')
}
