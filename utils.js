import Pino from 'pino';
import Minio from 'minio';

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
    endPoint: '86.50.253.134',
    port: 9000,
    useSSL: true,
    accessKey: 'minio',
    secretKey: 'minio123'
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

export default {}