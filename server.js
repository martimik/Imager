import express from "express";
import fileUpload from "express-fileupload";
import session from "express-session";
import cors from "cors";

import config from './config.js';
import { SessionConfig } from "./utils.js";

import { Database, seedIfNeeded } from "./database/index.js";

/* ============= App setup ============= */

//Database.drop();
Database.sync({ force: false });
seedIfNeeded();

const app = express();

app.use(cors({ credentials: true, origin: config.corsorigin }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileUpload({ useTempFiles: true, tempFileDir : '/tmp/' }));
app.use(session(SessionConfig));

/* ============= Routes ============= */

import usersRouter from './routes/users.js'
import imagesRouter from './routes/images.js'
import commentsRouter from './routes/comments.js'
import reportsRouter from './routes/reports.js'

app.use('/users', usersRouter);
app.use('/images', imagesRouter);
app.use('/comments', commentsRouter);
app.use('/reports', reportsRouter);

/* ============= Test routes ============= */

app.get("/test", (req, res) => {
    res.json({ message: "Ok" });
});

app.get("/session", (req, res) => {
    res.send({
        userId: req.session.userId,
        name: req.session.name,
        email: req.session.email,
        userGroup: req.session.userGroup
    });
});

app.listen(config.port, config.ip);
console.log("Server running on http://%s:%s", config.port, config.ip);
console.log("CORS ORIGIN:", config.corsorigin);

export default app;