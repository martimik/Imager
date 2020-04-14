import Sequelize from "sequelize";
import Bcrypt from 'bcrypt';

import UserModel from "./user.js";

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
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}


export const User = UserModel(Database);

export const seedIfNeeded = async () => {

    const userCount = await User.count()
    if (userCount > 0) return

    const testuser = await User.create({
        username: 'testuser',
        password: Bcrypt.hashSync('testpass', 10),
    })

    Logger.info('Seeded with test user:', testuser)
}

export default Database