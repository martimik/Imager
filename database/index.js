import Sequelize from "sequelize";
import Bcrypt from 'bcrypt';

import UserModel from "./user.js";
import ImageModel from "./image.js";
import CommentModel from "./comment.js";
import VoteModel from './vote.js';
import ReportModel from './report.js';

import Config from '../config.js';
import { DBLogger, Logger } from "../utils.js";

export const Database = new Sequelize({
    dialect: 'postgres',
    host: Config.pghost,
    port: Config.pgport,
    database: Config.pgdatabase,
    username: Config.pguser,
    password: Config.pgpass,
    logging: DBLogger.debug.bind(DBLogger),
})

try {
    Database.authenticate();
    console.log('DB connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

export const User = UserModel(Database);
export const Image = ImageModel(Database);
export const Comment = CommentModel(Database);
export const Vote = VoteModel(Database);
export const Report = ReportModel(Database);

export const Favorite = Database.define('favorite', {});

User.hasMany(Image);
Image.belongsTo(User);

User.belongsToMany(Image, { through: Favorite });
Image.belongsToMany(User, { through: Favorite });

User.belongsToMany(Image, { through: Vote });
Image.belongsToMany(User, { through: Vote });

User.hasMany(Comment);
Image.hasMany(Comment);

User.belongsToMany(Image, { through: Report });
Image.belongsToMany(User, { through: Report });

export const seedIfNeeded = async () => {

    const userCount = await User.count()
    console.log("User Count: " + userCount);
    console.log("Image count: " + await Image.count());
    console.log("Favorite count: " + await Favorite.count());
    console.log("Comment count: " + await Comment.count());
    console.log("Report count: " + await Report.count());
    console.log("Vote count: " + await Vote.count());

    if (userCount > 0) return

    const testuser = await User.create({
        username: 'testuser',
        password: Bcrypt.hashSync('testpass', 10),
        email: 'test@email.com',
        userGroup: 1
    })

    Logger.info('Seeded with test user', testuser)
}

export default Database
