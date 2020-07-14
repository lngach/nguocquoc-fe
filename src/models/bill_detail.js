const  sequelize =  require('../utils/provider')
const Sequelize = require('sequelize')
const Bill = require('./bill')
const Product = require('./product')

const BillDetail = sequelize.define('bill_details',
    {
        billID: {
            type: Sequelize.INTEGER.UNSIGNED,
            field: 'bill_id',
            primaryKey: true,
            references: {
                model: Bill,
                key: 'id'
            },
            allowNull: false,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        productID: {
            type: Sequelize.INTEGER.UNSIGNED,
            field: 'product_id',
            primaryKey: true,
            references: {
                model: Product,
                key: 'id'
            },
            allowNull: false,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        
        price: Sequelize.FLOAT,
        quantity: Sequelize.INTEGER,
        isActive: {
            type: Sequelize.BOOLEAN,
            field: 'is_active'
        },
        createdAt: {
            type: Sequelize.DATE(6),
            field: 'created_at'
        },
        updatedAt: {
            type: Sequelize.DATE(6),
            field: 'updated_at'
        }
    },
    {
        timestamps: false,
        indexes: [
            {
                name: 'bills_products_pk_index',
                fields: ['bill_id', 'product_id'],
                unique: true
            },
            {
                name: 'bill_details_products_fk',
                fields: ['product_id']
            },
            {
                name: 'bill_details_bill_fk',
                fields: ['bill_id']
            }
        ]
    }
)

module.exports = BillDetail