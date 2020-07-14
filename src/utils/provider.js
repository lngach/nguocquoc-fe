const Sequelize = require('sequelize')
const CONFIG = require('../config/config.db')

const sequelize = new Sequelize(
    CONFIG.DATABASE,
    CONFIG.USER,
    CONFIG.PASSWORD,
    {
        host: CONFIG.HOST,
        dialect: CONFIG.ADAPTER,
        operatorAliases: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
)

module.exports = sequelize