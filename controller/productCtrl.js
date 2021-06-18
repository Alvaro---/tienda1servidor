const Products = require('../models/productModel')

//Filter, sorting  and paginating

class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString
    }
    filtering() {
        const queryObj = { ...this.queryString } // this.queryString =req.query
        //console.log(queryObj) 
        //       console.log({before: queryObj}) //Antes de borrar la pagina
        const excludedFields = ['page', 'sort', 'limit']
        excludedFields.forEach(el => delete (queryObj[el]))

        //      console.log({after: queryObj}) //Despues de borrar la pagina

        let queryStr = JSON.stringify(queryObj)
        //console.log({queryObj, queryStr})
        //Operadores. greater than equal lower than equal 
        //regex. String inside
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

        //console.log({queryObj, queryStr})
        //      console.log({queryStr})

        this.query.find(JSON.parse(queryStr))

        return this;
    }

    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ')
            console.log(sortBy)
            this.query = this.query.sort(sortBy)
        } else {
            this.query = this.query.sort('-createdAt')
        }
        return this;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 3
        const skip = (page - 1) * limit;
        this.query * this.query.skip(skip).limit(limit)
        return this
    }
}

const productCtrl = {
    getProducts: async (req, res) => {
        try {
            //En lugar de encontrar todos los productos usa los metodos para ordenar y filtrar
            //const products = await Products.find()
            //  console.log(req.query)
            //http://localhost:5000/api/products?title=a El title se muestra en los params. con ? . Ese es el req.query
            const features = new APIfeatures(Products.find(), req.query)
                .filtering()
                .sorting()
                .paginating()
            const products = await features.query

            res.json({
                status: "success",
                result: products.length,
                products: products
            })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    createProduct: async (req, res) => {
        try {
            const { product_id, title, price, description, content, images, category } = req.body;
            if (!images) return res.status(400).json({ msg: "Sin imagen" })

            const product = await Products.findOne({ product_id })
            if (product) return res.status(400).json({ msg: "Ya existe el producto" })
            const newProduct = new Products({
                product_id,
                title: title.toLowerCase(),
                price,
                description,
                content,
                images,
                category
            })

            await newProduct.save()
            res.json({ msg: "Producto creado" })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteProduct: async (req, res) => {
        try {
            await Products.findByIdAndDelete(req.params.id)
            res.json({ msg: "Producto eliminado" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateProduct: async (req, res) => {
        try {
            const { title, price, description, content, images, category } = req.body;
            if (!images) return res.status(400).json({ msg: "Sin imagen" })

            await Products.findOneAndUpdate({ _id: req.params.id }, {
                title: title.toLowerCase(),
                price, description, content, images, category
            })

            res.json({ msg: "Producto actualizado" })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
}

module.exports = productCtrl