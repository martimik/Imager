import Pino from 'pino';
import Minio from 'minio';
import Validator from 'express-validator';
import Config from './config.js';

const { validationResult } = Validator;

export const DBLogger = Pino({
    name: 'Database',
    level: process.env.LOGLEVEL || 'info',
    prettyPrint: process.env.NODE_ENV !== 'production',
})

export const Logger = Pino({
    name: 'General',
    level: process.env.LOGLEVEL || 'info',
    prettyPrint: process.env.NODE_ENV !== 'production',
})


export const MinioClient = new Minio.Client({
    endPoint: Config.minioEndPoint,
    //port: 9000,
    useSSL: false,
    accessKey: Config.minioAccessKey,
    secretKey: Config.minioSecretKey
});

export const SessionConfig = {
    name: "auth",
    secret: "service#oriented#app",
    saveUninitialized: false,
    resave: true,
    rolling: true,
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 30 // 30 minutes
    }
};

/* Middleware to valitade request parameters and/or form data */
export function validate (req, res, next) {
    if (!validationResult(req).isEmpty()) {
        Logger.error(validationResult(req));
        res.setHeader("Content-Type", "application/json");
        res.send({ error: "Invalid data"});
    } else {
        next();
    }
}

/* Middleware to authenticate user through session parameters */ 
export function authenticate (req, res, next) {
    if (req.session.userGroup != 0 && req.session.userGroup != 1) {
        res.setHeader("Content-Type", "application/json");
        res.status(401);
        res.send({ message: "Unauthorized"});
    } else {
        next();
    }
};

export function authenticateAdmin (req, res, next) {
    if (req.session.userGroup != 0) {
        res.setHeader("Content-Type", "application/json");
        res.status(401);
        res.send({ message: "Unauthorized"});
    } else {
        next();
    }
};

export default {}