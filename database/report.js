import Sequelize from 'sequelize'

export default function (database) {
    return database.define('report', {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
        }
    })
}
