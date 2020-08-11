const express = require('express')
const router = express.Router()
const Product = require('../../models/product')
const Category = require('../../models/category')
const ProductType = require('../../models/product_type')
const ProductTypeWithProduct = require('../../models/product_type_with_product')
const ProductImage = require('../../models/product_image')
const Provider = require('../../models/provider')
const paginate = require('../../config/config.paginate')
const path = require('path')
const _ = require('lodash')

router.get('/', async (_, res) => {
  return index(res)
})

router.get('/:slug', async (req, res) => {
  switch (req.params.slug) {
    case 'trang-chu':
    case 'index.html':
    case 'index.php':
    case 'home':
      index(res)
      break
    case 'dich-vu':
      service(req, res)
      break
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
      break
    case 'robots.txt':
      robots(req, req)
      break
    case 'tin-tuc':
      news(req, res)
      break
    case 'bang-gia':
      pricing(res)
      break
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

const robots = (_, res) => {
  res.sendFile(path.resolve('robots.txt'))
}

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

const news = async (req, res) => {
  // 8 Tin mới nhất
  try {
    const category = await Category.findOne({
      where: {
        slug: req.params.slug,
        isActive: true,
      },
    })
    let products = await Product.findAndCountAll({
      ...paginate(req),
      order: [['updated_at', 'DESC']],
      where: { isActive: true },
      include: [
        {
          model: Provider,
          as: 'provider',
          where: { id: 26, isActive: true },
        },
        {
          model: Category,
          as: 'categories',
          where: { id: 12, isActive: true },
        },
        ProductType,
      ],
    })
    meta = { ...paginate(req), total: products.count, path: req.originalUrl }
    res.render('user/category', {
      title: category.name,
      main: category,
      products: products.rows,
      meta,
    })
  } catch (error) {
    res.render('user/category', {
      title: req.params.slug,
      main: null,
      products: [],
      meta: null,
    })
  }
}

const service = (_, res) => {
  res.render('user/services', { title: 'Dịch Vụ' })
}

const search = async (req, res) => {
  const key = req.query['tu-khoa']
  const title = key
  try {
    const products = await Product.findAndCountAll({
      ...paginate(req),
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
      include: [{ model: Category, as: 'categories' }, Provider, ProductType],
    })
    meta = { ...paginate(req), total: products.count, path: req.originalUrl }
    res.render('user/search', {
      products: products.rows,
      title,
      meta,
    })
  } catch (error) {
    res.render('user/search', {
      products: [],
      title,
      meta: null,
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
    const provider = await Provider.findOne({
      where: {
        slug: req.params.slug3,
        isActive: true,
      },
    })
    const products = await Product.findAndCountAll({
      ...paginate(req),
      include: [
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
    })
    meta = { ...paginate(req), total: products.count, path: req.originalUrl }
    res.render('user/category', {
      title: provider.name,
      main: provider,
      products: products.rows,
      meta,
    })
  } catch (error) {
    res.render('user/category', {
      title: req.params.slug3,
      main: null,
      products: [],
      meta: null,
    })
  }
}

const byCategory = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: {
        slug: req.params.slug2,
        isActive: true,
      },
    })

    const products = await Product.findAndCountAll({
      ...paginate(req),
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
    })
    meta = { ...paginate(req), total: products.count, path: req.originalUrl }
    res.render('user/category', {
      title: category.name,
      main: category,
      products: products.rows,
      meta,
    })
  } catch (error) {
    res.render('user/category', {
      title: req.params.slug,
      main: null,
      products: [],
      meta: null,
    })
  }
}

const byProductType = async (req, res) => {
  try {
    const product_type = await ProductType.findOne({
      where: {
        slug: req.params.slug,
        isActive: true,
      },
    })

    const products = await Product.findAndCountAll({
      ...paginate(req),
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
    })
    meta = { ...paginate(req), total: products.count, path: req.originalUrl }
    res.render('user/category', {
      title: product_type.name,
      main: product_type,
      products: products.rows,
      meta,
    })
  } catch (error) {
    res.render('user/category', {
      title: req.params.slug,
      main: null,
      products: [],
      meta: null,
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

const index = async (res) => {
  try {
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
    // 6 Tin mới nhất
    let news = await Product.findAll({
      limit: 6,
      order: [['updated_at', 'DESC']],
      where: { isActive: true },
      include: [
        {
          model: Provider,
          as: 'provider',
          where: { id: 26, isActive: true },
        },
        {
          model: Category,
          as: 'categories',
          where: { id: 12, isActive: true },
        },
        ProductType,
      ],
    })
    res.render('user/index', {
      title: 'Ngọc Quốc Computer - Sửa chữa lắp đặt thiết bị vi tính',
      newProducts,
      topSellProducts,
      topViewProducts,
      newProducts,
      news,
    })
  } catch (error) {
    res.render('user/index', {
      title: 'Ngọc Quốc Computer - Sửa chữa lắp đặt thiết bị vi tính',
      newProducts: [],
      topSellProducts: [],
      topViewProducts: [],
      newProducts: [],
      news: [],
    })
  }
}

const pricing = async (res) => {
  try {
    let productTypes = await ProductTypeWithProduct.findAll({
      include: [
        {
          model: Product,
          as: 'products',
          attributes: ['name', 'slug', 'id', 'price', 'warranty', 'image'],
          include: [
            {
              model: Category,
              as: 'categories',
              attributes: ['name'],
            },
          ],
        },
      ],
      attributes: ['name'],
      order: [[Product, 'name', 'ASC']],
    })
    let categories = productTypes.map((pt) => {
      let newPt = {}
      newPt.categories = _.groupBy(pt.products, (p) => p.categories.name)
      newPt.name = pt.name
      return newPt
    })
    res.render('user/pricing', { categories, title: 'Bảng Giá' })
  } catch (error) {
    res.render('user/pricing', { categories: [], title: 'Bảng Giá' })
  }
}

module.exports = router
