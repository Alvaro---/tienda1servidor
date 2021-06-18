const router = require('express').Router()
const productCtrl = require ('../controller/productCtrl')


router.route('/products')
    .get(productCtrl.getProducts)
    .post(productCtrl.createProduct)

router.route('/products/:id')
    .delete(productCtrl.deleteProduct)
    .put(productCtrl.updateProduct)

module.exports = router