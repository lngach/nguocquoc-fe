const  sequelize =  require('../utils/provider')
const Sequelize =  require('sequelize')

const BillState = sequelize.define('bill_states',
    {
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        name: Sequelize.STRING,
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
                name: 'bill_states_pk_index',
                fields: ['id']
            }
        ]
    }
)

module.exports = BillState