var express = require('express')
var router = express.Router()
var Slider = require('../../models/slider')
var Product = require('../../models/product')
var Category = require('../../models/category')
var ProductType = require('../../models/product_type')
var ProductImage = require('../../models/product_image')
var Provider = require('../../models/provider')
// var paginate = require('../../config/config.paginate')
const sequelize = require('sequelize')
const path = require('path')

router.get('/', async (_, res) => {
  try {
    //Top danh muc duoc quan tam nhieu nhat
    let categoryCollections = await Category.findAll({
      attributes: [
        'id',
        'name',
        'slug',
        [
          sequelize.literal(
            '(SELECT SUM(products.views) FROM products WHERE products.category_id = categories.id)'
          ),
          'totalView',
        ],
        [
          sequelize.literal(
            '(SELECT image from products WHERE products.category_id = categories.id ORDER BY RAND() limit 1)'
          ),
          'image',
        ],
      ],
      where: { id: { $not: 4 }, isActive: true },
      order: [[sequelize.literal('totalView'), 'DESC']],
      limit: 3,
    })

    // 8 san pham moi nhat
    let generalProducts = await Product.findAll({
      limit: 8,
      order: [['updatedAt', 'DESC']],
      include: [
        Provider,
        {
          model: Category,
          as: 'categories',
          where: { id: 5, isActive: true },
        },
        ProductType,
      ],
      where: { isActive: true },
    })

    // 6 san pham dc ban chay nhat
    let solarPinProducts = await Product.findAll({
      limit: 8,
      order: [['sales', 'DESC']],
      where: { isActive: true },
      include: [
        Provider,
        {
          model: Category,
          as: 'categories',
          where: { id: 2, isActive: true },
        },
        ProductType,
      ],
    })

    // 6 san pham duoc quan tam nhieu nhat
    let inverterProducts = await Product.findAll({
      limit: 8,
      order: [['views', 'DESC']],
      where: { isActive: true },
      include: [
        Provider,
        {
          model: Category,
          as: 'categories',
          where: { id: 1, isActive: true },
        },
        ProductType,
      ],
    })

    // 6 san pham duoc quan tam nhieu nhat
    let solarLightProducts = await Product.findAll({
      limit: 8,
      order: [['views', 'DESC']],
      where: { isActive: true },
      include: [
        Provider,
        {
          model: Category,
          as: 'categories',
          where: { id: 3, isActive: true },
        },
        ProductType,
      ],
    })

    // 6 Tin Tưc Mới Nhất
    let completeConstructs = await Product.findAll({
      limit: 8,
      order: [['updated_at', 'DESC']],
      where: { isActive: true },
      include: [
        Provider,
        {
          model: Category,
          as: 'categories',
          where: { id: 4, isActive: true },
        },
        ProductType,
      ],
    })

    // 6 Tin Tưc Mới Nhất
    let news = await Product.findAll({
      limit: 8,
      order: [['updated_at', 'DESC']],
      where: { isActive: true },
      include: [
        Provider,
        {
          model: Category,
          as: 'categories',
          where: { id: 6, isActive: true },
        },
        ProductType,
      ],
    })

    let sliders = await Slider.findAll({
      where: {
        isActive: true,
      },
    })

    res.render('user/index', {
      title: 'Đức Khiêm Solar Vũng Tàu',
      generalProducts,
      solarPinProducts,
      inverterProducts,
      categoryCollections,
      solarLightProducts,
      completeConstructs,
      news,
      sliders,
    })
  } catch (error) {
    res.render('user/index', {
      title: 'Đức Khiêm Solar Vũng Tàu',
      generalProducts: [],
      solarPinProducts: [],
      inverterProducts: [],
      categoryCollections: [],
      completeConstructs: [],
      solarLightProducts: [],
      news: [],
      sliders: [],
    })
  }
})

router.get('/:slug', async (req, res) => {
  switch (req.params.slug) {
    case 'tim-kiem':
      search(req, res)
      break
    case 'lien-he':
      contact(req, res)
      break
    case 'gioi-thieu':
      intro(req, res)
      break
    case 'gio-hang':
      card(req, res)
      break
    case 'sitemap.xml':
      sitemap(req, res)
    default:
      show(req, res)
      break
  }
})

router.get('/danh-muc/:slug', async (req, res) => {
  try {
    // Top danh muc duoc quan tam nhieu nhat
    const categoryCollections = await Category.findAll({
      attributes: [
        'id',
        'name',
        'slug',
        [
          sequelize.literal(
            '(SELECT SUM(products.views) FROM products WHERE products.category_id = categories.id)'
          ),
          'totalView',
        ],
        [
          sequelize.literal(
            '(SELECT image from products WHERE products.category_id = categories.id ORDER BY RAND() limit 1)'
          ),
          'image',
        ],
      ],
      where: { id: { $notIn: [4, 6] }, isActive: true },
      order: [[sequelize.literal('totalView'), 'DESC']],
      limit: 3,
    })

    const category = await Category.findOne({
      where: {
        slug: req.params.slug,
        isActive: true,
      },
    })

    const products = await Product.findAll({
      include: [
        Provider,
        {
          model: Category,
          as: 'categories',
          where: {
            '$categories.slug$': req.params.slug,
            '$categories.is_active$': true,
          },
        },
        ProductType,
        ProductImage,
      ],
      where: { isActive: true },
      order: [
        ['views', 'DESC'],
        ['sales', 'DESC'],
      ],
      limit: 8,
    })

    let view = 'user/category'
    res.render(view, {
      title: category.name,
      main: category,
      products,
      categoryCollections,
    })
  } catch (error) {
    res.render(view, {
      title: req.params.slug,
      main: null,
      products: [],
      categoryCollections: [],
    })
  }
})

router.get('/danh-muc/:slug/:slug2', async (req, res) => {
  try {
    // Top danh muc duoc quan tam nhieu nhat
    const categoryCollections = await Category.findAll({
      attributes: [
        'id',
        'name',
        'slug',
        [
          sequelize.literal(
            '(SELECT SUM(products.views) FROM products WHERE products.category_id = categories.id)'
          ),
          'totalView',
        ],
        [
          sequelize.literal(
            '(SELECT image from products WHERE products.category_id = categories.id ORDER BY RAND() limit 1)'
          ),
          'image',
        ],
      ],
      where: { id: { $notIn: [4, 6] }, isActive: true },
      order: [[sequelize.literal('totalView'), 'DESC']],
      limit: 3,
    })

    let main = null

    const provider = await Provider.findOne({
      where: {
        slug: req.params.slug2,
        isActive: true,
      },
    })

    main = provider

    if (provider.id === 15) {
      main = await Category.findOne({
        where: {
          slug: req.params.slug,
          isActive: true,
        },
      })
    }

    const products = await Product.findAll({
      // where: { '$categories.slug$': req.params.slug },
      include: [
        Provider,
        {
          model: Category,
          as: 'categories',
          where: {
            '$categories.slug$': req.params.slug,
            '$categories.is_active$': true,
          },
        },
        {
          model: Provider,
          as: 'provider',
          where: {
            '$provider.slug$': req.params.slug2,
            '$provider.is_active$': true,
          },
        },
        ProductType,
        ProductImage,
      ],
      order: [
        ['views', 'DESC'],
        ['sales', 'DESC'],
      ],
      where: { isActive: true },
      limit: 8,
    })
    let view = 'user/provider'
    res.render(view, {
      title: main.name,
      main: main,
      products,
      categoryCollections,
    })
  } catch (error) {
    res.render(view, {
      title: req.params.slug2,
      main: null,
      products: [],
      categoryCollections: [],
    })
  }
})

const sitemap = (_, res) => {
  res.sendFile(path.resolve('sitemap.xml'))
}

const intro = (_, res) => {
  res.render('user/about', { title: 'Giới Thiệu' })
}

const contact = (_, res) => {
  res.render('user/contact', { title: 'Liên Hệ' })
}

const card = (_, res) => {
  res.render('404', { title: 'Giỏ hàng trống' })
}

const search = async (req, res) => {
  try {
    const key = req.query['tu-khoa']
    const title = key
    const products = await Product.findAll({
      where: {
        isActive: true,
        $or: [
          {
            name: {
              $like: `%${key}%`,
            },
          },
          {
            '$categories.name$': {
              $like: `%${key}%`,
            },
          },
          {
            '$provider.name$': {
              $like: `%${key}%`,
            },
          },
        ],
      },
      include: [{ model: Category, as: 'categories' }, Provider],
    })
    res.render('user/search', {
      products,
      title,
    })
  } catch (error) {
    res.render('user/search', {
      products: [],
    })
  }
}

const show = async (req, res) => {
  let view = 'user/show'
  try {
    let toUpdateProduct = await Product.findOne({
      where: { slug: req.params.slug, isActive: true },
      include: [
        Provider,
        { model: Category, as: 'categories', where: { isActive: true } },
        ProductType,
        ProductImage,
      ],
    })
    if (toUpdateProduct == null) {
      return res.render('404', { title: 'Trang không tìm thấy' })
    }
    const product = await toUpdateProduct.update({
      views: toUpdateProduct.views + 1,
    })
    const relatedProducts = await Product.findAll({
      where: {
        category_id: product.category_id,
        provider_id: product.provider_id,
        product_type_id: product.product_type_id,
        isActive: true,
      },
      include: [
        Provider,
        {
          model: Category,
          as: 'categories',
          where: { isActive: true },
        },
        ProductType,
      ],
      limit: 8,
    })
    res.render(view, {
      title: product.name,
      product,
      relatedProducts: relatedProducts,
    })
  } catch (error) {
    res.render(view, {
      title: 'Không tìm thấy bài đăng',
      product: null,
      relatedProducts: [],
    })
  }
}

module.exports = router
