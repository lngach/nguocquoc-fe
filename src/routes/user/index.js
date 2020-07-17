var express = require('express')
var router = express.Router()
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
      where: { id: { $not: 12 }, isActive: true },
      order: [[sequelize.literal('totalView'), 'DESC']],
      limit: 3,
    })

    // 8 san pham moi nhat
    let newProducts = await Product.findAll({
      limit: 8,
      order: [['updated_at', 'DESC']],
      include: [
        Provider,
        {
          model: Category,
          as: 'categories',
          where: { id: { $not: 12 }, isActive: true },
        },
        ProductType,
      ],
      where: { isActive: true },
    })

    // 8 san pham dc ban chay nhat
    let topSellProducts = await Product.findAll({
      limit: 8,
      order: [['sales', 'DESC']],
      where: { isActive: true },
      include: [
        Provider,
        {
          model: Category,
          as: 'categories',
          where: { id: { $not: 12 }, isActive: true },
        },
        ProductType,
      ],
    })

    // 8 san pham duoc quan tam nhieu nhat
    let topViewProducts = await Product.findAll({
      limit: 8,
      order: [['views', 'DESC']],
      where: { isActive: true },
      include: [
        Provider,
        {
          model: Category,
          as: 'categories',
          where: { id: { $not: 12 }, isActive: true },
        },
        ProductType,
      ],
    })
    res.render('user/index', {
      title: 'Ngọc Quốc Computer',
      newProducts,
      topSellProducts,
      topViewProducts,
      categoryCollections,
      newProducts,
      news: [],
    })
  } catch (error) {
    res.render('user/index', {
      title: 'Ngọc Quốc Computer',
      newProducts: [],
      topSellProducts: [],
      categoryCollections: [],
      topViewProducts: [],
      newProducts: [],
      news: [],
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
      if (await checkProduct(req)) return show(req, res)
      byProductType(req, res)
      break
  }
})

router.get('/:slug/:slug2', async (req, res) => {
  return byCategory(req, res)
})

router.get('/:slug/:slug2/:slug3', async (req, res) => {
  return byProvider(req, res)
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

const byProvider = async (req, res) => {
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
      where: { isActive: true },
      order: [[sequelize.literal('totalView'), 'DESC']],
      limit: 3,
    })

    const provider = await Provider.findOne({
      where: {
        slug: req.params.slug3,
        isActive: true,
      },
    })

    const products = await Product.findAll({
      // where: { '$categories.slug$': req.params.slug },
      include: [
        Provider,
        {
          model: Category,
          as: 'categories',
          where: {
            '$categories.slug$': req.params.slug2,
            '$categories.is_active$': true,
          },
        },
        {
          model: Provider,
          as: 'provider',
          where: {
            '$provider.slug$': req.params.slug3,
            '$provider.is_active$': true,
          },
        },
        {
          model: ProductType,
          as: 'product_type',
          where: {
            '$product_type.slug$': req.params.slug,
            '$product_type.is_active$': true,
          },
        },
        ProductImage,
      ],
      order: [
        ['views', 'DESC'],
        ['sales', 'DESC'],
      ],
      where: { isActive: true },
      limit: 8,
    })
    res.render('user/category', {
      title: provider.name,
      main: provider,
      products,
      categoryCollections,
    })
  } catch (error) {
    res.render('user/category', {
      title: req.params.slug3,
      main: null,
      products: [],
      categoryCollections: [],
    })
  }
}

const byCategory = async (req, res) => {
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
      where: { isActive: true },
      order: [[sequelize.literal('totalView'), 'DESC']],
      limit: 3,
    })

    const category = await Category.findOne({
      where: {
        slug: req.params.slug2,
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
            '$categories.slug$': req.params.slug2,
            '$categories.is_active$': true,
          },
        },
        {
          model: ProductType,
          as: 'product_type',
          where: {
            '$product_type.slug$': req.params.slug,
            '$product_type.is_active$': true,
          },
        },
        ProductImage,
      ],
      where: { isActive: true },
      order: [
        ['views', 'DESC'],
        ['sales', 'DESC'],
      ],
      limit: 8,
    })
    res.render('user/category', {
      title: category.name,
      main: category,
      products,
      categoryCollections,
    })
  } catch (error) {
    console.log(error)
    res.render('user/category', {
      title: req.params.slug,
      main: null,
      products: [],
      categoryCollections: [],
    })
  }
}

const byProductType = async (req, res) => {
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
      where: { id: { $not: 12 }, isActive: true },
      order: [[sequelize.literal('totalView'), 'DESC']],
      limit: 3,
    })

    const product_type = await ProductType.findOne({
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
        },
        {
          model: ProductType,
          as: 'product_type',
          where: {
            '$product_type.slug$': req.params.slug,
            '$product_type.is_active$': true,
          },
        },
        ProductImage,
      ],
      where: { isActive: true },
      order: [
        ['views', 'DESC'],
        ['sales', 'DESC'],
      ],
      limit: 8,
    })
    res.render('user/category', {
      title: product_type.name,
      main: product_type,
      products,
      categoryCollections,
    })
  } catch (error) {
    res.render('user/category', {
      title: req.params.slug,
      main: null,
      products: [],
      categoryCollections: [],
    })
  }
}

const checkProduct = async (req) => {
  try {
    const product = await Product.findOne({ where: { slug: req.params.slug } })
    if (product === null) return false
    return true
  } catch (error) {
    return false
  }
}

module.exports = router
