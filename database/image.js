import Sequelize from 'sequelize'

export default function (database) {
    return database.define('image', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        userId: {
            type: Sequelize.UUID,
            foreingKey: true,
            allowNull: false,
        },
        title: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        uploadDate: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        isprivate: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
    })
}
