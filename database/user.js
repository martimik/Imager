import Sequelize from 'sequelize'

export default function (database) {
    return database.define('user', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        username: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        email: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        password: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        userGroup: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    }, {
        scopes: {
            withoutPassword: {
                attributes: { exclude: ['password'] },
            },
        },
    })
}