const sequelize = require('../utils/provider')
const Sequelize = require('sequelize')
const Product = require('./product')

const ProductTypeWithProduct = sequelize.define(
  'product_types',
  {
    id: {
      type: Sequelize.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    slug: {
      type: Sequelize.STRING,
      unique: true,
    },
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
        name: 'product_types_pk_index',
        fields: ['id'],
      },
    ],
  }
)

ProductTypeWithProduct.hasMany(Product, {
  foreignKey: 'product_type_id',
  targetKey: 'id',
  allowNull: false,
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
})

module.exports = ProductTypeWithProduct
