import commandLineArgs from 'command-line-args'

export default commandLineArgs([
    {
        name: 'port',
        alias: 'p',
        type: Number,
        defaultValue: process.env.PORT || 8080,
    },
    {
        name: 'pghost',
        type: String,
        defaultValue: process.env.PGHOST || 'localhost',
    },
    {
        name: 'pgport',
        type: Number,
        defaultValue: process.env.PGPORT || '5432',
    },
    {
        name: 'pgdatabase',
        type: String,
        defaultValue: process.env.PGDATABASE || 'postgres',
    },
    {
        name: 'pguser',
        type: String,
        defaultValue: process.env.PGUSER || 'postgres',
    },
    {
        name: 'pgpass',
        type: String,
        defaultValue: process.env.PGPASS || 'postgres',
    },
    {
        name: "corsorigin",
        type: String,
        defaultValue: process.env.allowed_origins || "http://localhost:8080"
    },
    {
        name: 'minioEndPoint',
        type: String,
        defaultValue: process.env.MINIOENDPOINT || 'minio.imager.local'
    },
    {
        name: 'minioPort',
        type: Number,
        defaultValue: process.env.MINIOPORT || '9000'
    },
    {
        name: 'minioAccessKey',
        type: String,
        defaultValue: process.env.MINIOACCESSKEY || 'minio'
    },
    {
        name: 'minioSecretKey',
        type: String,
        defaultValue: process.env.MINIOSECRETKEY || 'minio123'
    },
])
