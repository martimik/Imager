import Sequelize from 'sequelize'

export default function (database) {
    return database.define('comment', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false,
        }
    })
}
