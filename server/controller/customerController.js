const User = require('../model/User')

exports.index = async (req, res) => {
  const { searchKey = '', searchStatus = '', page = 1 } = req.query

  const query = {}
  query.role = 'user'
  if (searchKey) {
    query.fullName = { $regex: new RegExp(searchKey, 'i') }
  }
  if (searchStatus) {
    query['status'] = searchStatus
  }

  const limit = 5
  const totalCustomers = await User.countDocuments(query)
  const totalPages = Math.ceil(totalCustomers / limit)

  const customers = await User.find(query)
    .sort({ ['_id']: 'desc' })
    .skip((page - 1) * limit)
    .limit(limit)

  res.render('pages/customer/index', {
    page: 'customers',
    customers,
    searchKey,
    searchStatus,
    currentPage: page,
    totalPages,
    success: req.flash('success'),
    error: req.flash('error'),
  })
}

exports.look = async (req, res) => {
  if (!req.params.id) {
    res.status(404).send({ type: 'error', message: 'Không tìm thấy khách hàng' })
  }
  const id = req.params.id

  User.findByIdAndUpdate(id, { status: false }, { returnDocument: 'after' })
    .then(data => {
      if (!data) {
        res.status(404).send({ type: 'error', message: 'Không tìm thấy khách hàng' })
      } else {
        res.send({
          type: 'success',
          message: 'Khóa tài khoản thành công',
          data: getDataTableCustomer(data),
        })
      }
    })
    .catch(err => {
      const message = err.message || 'Lỗi máy chủ'
      req.status(500).send('error', message)
    })
}

exports.unLook = async (req, res) => {
  if (!req.params.id) {
    res.status(404).send({ type: 'error', message: 'Không tìm thấy khách hàng' })
  }
  const id = req.params.id

  User.findByIdAndUpdate(id, { status: true }, { returnDocument: 'after' })
    .then(data => {
      if (!data) {
        res.status(404).send({ type: 'error', message: 'Không tìm thấy khách hàng' })
      } else {
        res.send({
          type: 'success',
          message: 'Mở khóa tài khoản thành công',
          data: getDataTableCustomer(data),
        })
      }
    })
    .catch(err => {
      const message = err.message || 'Lỗi máy chủ'
      req.status(500).send('error', message)
    })
}

const getDataTableCustomer = customer => {
  let actionHtml = ''
  if (customer.status) {
    actionHtml = `<button
                    type="button"
                    class="btn btn-danger"
                    title="Khóa tài khoản"
                    onclick="lookCustomer('${customer._id}')"
                  >
                    <i class="fa-regular fa-lock"></i>
                  </button>`
  } else {
    actionHtml = `<button
                    type="button"
                    class="btn btn-success"
                    title="Mở khóa tài khoản"
                    onclick="unLookCustomer('${customer._id}')"
                  >
                    <i class="fa-regular fa-lock-open"></i>
                  </button>`
  }

  let statusHtml = ''
  if (customer.status) {
    statusHtml = `<div class="badge text-bg-success">Đang hoạt động</div>`
  } else {
    statusHtml = `<div class="badge text-bg-secondary">Đã khóa</div>`
  }

  return `<tr id="tr-${customer._id}">
            <th>${customer._id}</th>
            <td>
              <img
                src="${customer.avatarUrl || '/dist/img/user-avatar-default.png'}"
                style="height: 80px; border-radius: 50%"
              />
            </td>
            <td>${customer.fullName}</td>
            <td>${customer.email}</td>
            <td>${statusHtml}</td>
            <td>${actionHtml}</td>
          </tr>`
}
