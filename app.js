const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const pagesRouter = require('./src/routes/user/index')
const sequelize = require('./src/utils/provider')
const Category = require('./src/models/category')
const { QueryTypes } = require('sequelize')
var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'src/views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static('src/public'))

app.use(async (req, res, next) => {
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
          '(SELECT product_types.slug FROM product_types, products WHERE products.category_id = categories.id AND products.product_type_id = product_types.id limit 1)'
        ),
        'productTypeSlug',
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

  let categories = await sequelize.query(
    `SELECT
        GROUP_CONCAT(DISTINCT c.name SEPARATOR ',') as categoryNames,
        GROUP_CONCAT(DISTINCT c.slug SEPARATOR ',') as categorySlugs,
        pt.id, pt.name, pt.slug
      FROM
        products p, categories c, product_types pt
      WHERE
        p.category_id = c.id
        AND p.product_type_id = pt.id
      GROUP BY pt.name, pt.slug
      ORDER BY pt.id ASC`,
    { type: QueryTypes.SELECT }
  )
  let providers = await sequelize.query(
    `SELECT
        GROUP_CONCAT(DISTINCT pd.name SEPARATOR ',') as providerNames,
        GROUP_CONCAT(DISTINCT pd.slug SEPARATOR ',') as providerSlugs,
        c.id, c.name, c.slug
      FROM
        products p, categories c, providers pd
      WHERE
        p.category_id = c.id
        AND p.provider_id = pd.id
        AND p.is_active = 1
      GROUP BY c.name, c.slug
      ORDER BY c.id ASC`,
    { type: QueryTypes.SELECT }
  )
  categories = categories.map((item) => {
    let newItem = { ...item }
    newItem.categoryNames = newItem.categoryNames.split(',')
    newItem.categorySlugs = newItem.categorySlugs.split(',')
    newItem.categories = []
    newItem.categoryNames.forEach((_, index) => {
      newItem.categories.push({
        name: newItem.categoryNames[index],
        slug: newItem.categorySlugs[index],
      })
    })
    delete newItem.categoryNames
    delete newItem.categorySlugs
    return newItem
  })
  providers = providers.map((item) => {
    let newItem = { ...item }
    newItem.providerNames = newItem.providerNames.split(',')
    newItem.providerSlugs = newItem.providerSlugs.split(',')
    newItem.providers = []
    newItem.providerNames.forEach((_, index) => {
      newItem.providers.push({
        name: newItem.providerNames[index],
        slug: newItem.providerSlugs[index],
      })
    })
    delete newItem.providerNames
    delete newItem.providerSlugs
    return newItem
  })
  categories = categories.map((pt) => {
    let newPt = { ...pt }
    newPt.categories = newPt.categories.map((c) => {
      let newItem
      providers.forEach((p) => {
        if (c.name === p.name) {
          newItem = p
          return
        }
      })
      return newItem
    })
    return newPt
  })
  const fullUrl = req.protocol + 's://' + req.get('host') + req.originalUrl
  res.locals.canonical = fullUrl.replace(/\?.*$/, '')
  res.locals.categoryCollections = categoryCollections
  res.locals.runtimeCategories = categories
  next()
})

app.use(pagesRouter)

// catch 404 and forward to error handler
app.use(function (_, res) {
  res.status(404).render('404', { title: 'Trang không tìm thấy' })
})

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
