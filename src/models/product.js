const sequelize = require('../utils/provider')
const Sequelize = require('sequelize')
const ProductType = require('./product_type')
const Provider = require('./provider')
const Category = require('./category')
const ProductImage = require('./product_image')

const Product = sequelize.define(
  'products',
  {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    slug: {
      type: Sequelize.STRING,
      unique: true,
    },
    name: Sequelize.STRING,
    image: Sequelize.STRING,
    price: Sequelize.FLOAT,
    views: Sequelize.INTEGER,
    sales: Sequelize.INTEGER,
    discount: Sequelize.INTEGER,
    warranty: Sequelize.INTEGER,
    status: Sequelize.BOOLEAN,
    content: Sequelize.TEXT,
    isActive: {
      type: Sequelize.BOOLEAN,
      field: 'is_active',
    },
    createdAt: {
      type: Sequelize.DATE(6),
      field: 'created_at',
    },
    updatedAt: {
      type: Sequelize.DATE(6),
      field: 'updated_at',
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        name: 'products_pk_index',
        fields: ['id'],
      },
      {
        name: 'products_product_types_fk_index',
        fields: ['product_type_id'],
      },
      {
        name: 'products_providers_fk_index',
        fields: ['provider_id'],
      },
      {
        name: 'products_categories_fk_index',
        fields: ['category_id'],
      },
    ],
  }
)

Product.hasMany(ProductImage, {
  foreignKey: 'product_id',
})
Category.hasMany(Product, {
  as: 'products',
  foreignKey: 'category_id',
})
Product.belongsTo(Category, {
  as: 'categories',
  foreignKey: 'category_id',
  targetKey: 'id',
  allowNull: false,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
})
Product.belongsTo(Provider, {
  foreignKey: 'provider_id',
  targetKey: 'id',
  allowNull: false,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
})
Product.belongsTo(ProductType, {
  foreignKey: 'product_type_id',
  targetKey: 'id',
  allowNull: false,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
})

module.exports = Product
