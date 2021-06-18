const { findByIdAndUpdate, findOneAndUpdate } = require('../models/categoryModel')
const Category = require('../models/categoryModel')

const categoryCtrl = {
    getCategories: async (req, res) => {
        try {
            const categories = await Category.find()
            res.json(categories)
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    createCategory: async (req, res) => {
        try {
            // res.json('chaeck admin success')
            const { name } = req.body;
            const category = await Category.findOne({ name })
            if (category) return res.status(400).json({ msg: "La categorua ya existe" })
            const newCategory = new Category({ name })
            await newCategory.save()
            res.json({ msg: "Categoria Creada" })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    deleteCategory: async (req, res) => {
        try {
            await Category.findByIdAndDelete(req.params.id)
            res.json({msg:"Categrotia Eliminada"})
        } catch (error) {
            return res.status(500).json({ msg: err.message })
        }
    },
    updateCategory: async (req, res) => {
        try {
            const {name}=req.body;
            await Category.findOneAndUpdate ({_id: req.params.id}, {name})
            res.json({msg:"Caregoria actualizada"})
        } catch (error) {
            return res.status(500).json({ msg: err.message })
        }
    }
}

module.exports = categoryCtrl