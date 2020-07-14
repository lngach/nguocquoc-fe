const  sequelize =  require('../utils/provider')
const Sequelize =  require('sequelize')

const User = sequelize.define('users', {
        id: {
          type: Sequelize.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true
        },
        name: Sequelize.STRING,
        avatar: {
        	type: Sequelize.STRING,
			allowNull: false,
			unique: true
		},
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: {
              msg: "Email address must be valid"
            }
          }
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        tokens: Sequelize.TEXT,
        resetPasswordToken: {
          type: Sequelize.STRING,
          field: 'reset_password_token'
        },
        resetPasswordSentAt: {
          type: Sequelize.Sequelize.DATE(6),
          field: 'reset_password_sent_at'
        },
        confirmationToken: {
          type: Sequelize.STRING,
          field: 'confirmation_token'
        },
        confirmationSentAt: {
          type: Sequelize.DATE(6),
          field: 'confirmation_sent_at'
        },
        confirmedAt: {
          type: Sequelize.DATE(6),
          field: 'confirmed_at'
        },
        currentSigninAt: {
          type: Sequelize.DATE(6),
          field: 'current_sign_in_at'
        },
        currentSigninIP: {
          type: Sequelize.STRING,
          field: 'current_sign_in_ip'
        },
        lastSigninAt: {
          type: Sequelize.DATE(6),
          field: 'last_sign_in_at'
        },
        lastSigninIP: {
          type: Sequelize.STRING,
          field: 'last_sign_in_ip'
        },
        signinCount: {
          type: Sequelize.INTEGER,
          field: 'sign_in_count',
          defaultValue: 0
        },
        lockedAt: {
          type: Sequelize.DATE(6),
          field: 'locked_at'
        },
        disable: Sequelize.BOOLEAN,
        isAdmin: {
          type: Sequelize.BOOLEAN,
          field: 'is_admin'
        },
        createdAt: {
          type: Sequelize.DATE(6),
          field: 'created_at',
          defaultValue: Sequelize.NOW
        },
        updatedAt: {
          type: Sequelize.DATE(6),
          field: 'updated_at',
          defaultValue: Sequelize.NOW
        }
    },
    {
        timestamps: false,
        indexes: [
            {
                name: 'users_pk_index',
                fields: ['id']
            },
            {
                name: 'users_unique_email_index',
                unique: true,
                fields: ['email']
            }
        ]
    }
)

module.exports = User
