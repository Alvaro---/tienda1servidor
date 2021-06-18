const router = require('express').Router()
const categoryCtrl = require('../controller/categoryCtrl')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')

router.route('/category')
    .get(categoryCtrl.getCategories)
    .post(auth, authAdmin, categoryCtrl.createCategory)
//Only admin can create update and delete. (El auth coloca con la cookie el ID del usuarioen el token y el auth admin lo valida. )

router.route('/category/:id')
    .delete(auth, authAdmin, categoryCtrl.deleteCategory)
    .put(auth, authAdmin, categoryCtrl.updateCategory)


module.exports = router
