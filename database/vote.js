import Sequelize from 'sequelize'

export default function (database) {
    return database.define('vote', {
        type: {
            type: Sequelize.ENUM,
            allowNull: false,
            values: ['upvote', 'downvote']
        }
    })
}
