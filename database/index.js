import Sequelize from "sequelize";
import Bcrypt from 'bcrypt';

import UserModel from "./user.js";
import ImageModel from "./image.js";
import FavoriteModel from './favorite.js'

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
export const Favorite = FavoriteModel(Database);

User.hasMany(Image);
Image.belongsTo(User);

User.hasMany(Favorite);
Favorite.belongsTo(User);

Image.hasMany(Favorite);
Favorite.belongsTo(Image);

export const seedIfNeeded = async () => {

    const userCount = await User.count()
    console.log("User Count: " + userCount);
    console.log("Image count: " + await Image.count());
    console.log("Favorite count: " + await Favorite.count());

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