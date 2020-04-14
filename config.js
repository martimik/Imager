import commandLineArgs from 'command-line-args'

export default commandLineArgs([
    {
        name: 'ip',
        type: Number,
        defaultValue: process.env.IP || "localhost",
    },
    {
        name: 'port',
        alias: 'p',
        type: Number,
        defaultValue: process.env.PORT || 3000,
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
        defaultValue: process.env.PGDATABASE || 'imager', // update database name here
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
        name: 'jwtsecret',
        type: String,
        defaultValue: process.env.JWTSECRET || 'supersecretjwtkey',
    },
    {
        name: "corsorigin",
        type: String,
        defaultValue: process.env.allowed_origins || "http://localhost:3000"
    },
])
