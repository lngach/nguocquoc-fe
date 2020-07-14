const sequelize = require('../utils/provider')
const Sequelize = require('sequelize')
const Product = require('./product')

const ProductImage = sequelize.define(
	'product_images',
	{
		id: {
			type: Sequelize.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		url: Sequelize.STRING,
		productID: {
			field: 'product_id',
			type: Sequelize.INTEGER.UNSIGNED,
			allowNull: false,
			references: {
				model: Product,
				key: 'id',
			},
			allowNull: false,
			onDelete: 'CASCADE',
			onUpdate: 'CASCADE',
		},
		isActive: {
			type: Sequelize.BOOLEAN,
			field: 'is_active',
		},
		createdAt: {
			type: Sequelize.DATE(6),
			field: 'created_at',
			defaultValue: Sequelize.NOW,
		},
		updatedAt: {
			type: Sequelize.DATE(6),
			field: 'updated_at',
			defaultValue: Sequelize.NOW,
		},
	},
	{
		timestamps: false,
		indexes: [
			{
				name: 'product_images_pk_index',
				fields: ['id'],
			},
			{
				name: 'product_images_product_fk_index',
				fields: ['product_id'],
			},
		],
	}
)

// ProductImage.belongsTo(Product, {
// 	foreignKey: 'product_id',
// 	targetKey: 'id',
// 	allowNull: false,
// 	onDelete: 'CASCADE',
// 	onUpdate: 'CASCADE',
// })
module.exports = ProductImage
