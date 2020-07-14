const  sequelize =  require('../utils/provider')
const Sequelize =  require('sequelize')

const Provider = sequelize.define('providers',
    {
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        name: Sequelize.STRING,
        slug: {
            type: Sequelize.STRING,
            unique: true
        },
        website: Sequelize.STRING,
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
                name: 'providers_pk_index',
                fields: ['id']
            }
        ]
    }
)

module.exports = Provider