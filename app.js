var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var pagesRouter = require('./src/routes/user/index')
const sequelize = require('./src/utils/provider')
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

app.use(async (_, res, next) => {
  let categories = await sequelize.query(
    `SELECT GROUP_CONCAT(DISTINCT pd.name SEPARATOR ',') as providerNames, GROUP_CONCAT(DISTINCT pd.slug SEPARATOR ',') as providerSlugs, c.id, c.name, c.slug  FROM products p, categories c, providers pd WHERE p.category_id = c.id AND p.provider_id = pd.id GROUP BY c.name, c.slug ORDER BY c.id ASC`,
    { type: QueryTypes.SELECT }
  )
  categories = categories.map((item) => {
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
  res.locals.runtimeCategories = categories
  next()
})

app.use(pagesRouter)

// catch 404 and forward to error handler
app.use(function (_, _, next) {
  next(createError(404))
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
