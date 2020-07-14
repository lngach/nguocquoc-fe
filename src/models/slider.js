const  sequelize =  require('../utils/provider')
const Sequelize =  require('sequelize')

const Slider = sequelize.define('sliders',
    {
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        url: Sequelize.STRING,
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
                name: 'sliders_pk_index',
                fields: ['id']
            }
        ]
    }
)

module.exports = Slider