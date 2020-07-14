const  sequelize =  require('../utils/provider')
const Sequelize =  require('sequelize')
const User =  require('./user')
const BillState =  require('./bill_state')

const Bill = sequelize.define('bills',
    {
        id: {
            type: Sequelize.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        userID: {
            type: Sequelize.INTEGER.UNSIGNED,
            field: 'user_id',
            references: {
                model: User,
                key: 'id'
            },
            allowNull: false,
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        },
        billStateID: {
            type: Sequelize.INTEGER.UNSIGNED,
            field: 'bill_state_id',
            references: {
                model: BillState,
                key: 'id'
            },
            allowNull: false,
            onDelete: 'NO ACTION',
            onUpdate: 'CASCADE'
        },
        totalAmount: Sequelize.FLOAT,
        description: Sequelize.TEXT,
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
                name: 'bills_pk_index',
                fields: ['id']
            },
            {
                name: 'bills_users_fk_index',
                fields: ['user_id']
            },
            {
                name: 'bills_bill_states_fk_index',
                fields: ['bill_state_id']
            }
        ]
    }
)

module.exports = Bill