const express = require("express");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const { body } = require("express-validator/check");
const app = express();

const config = require("./config");

const CORS_ORIGIN = "http://localhost:3000";

console.log("CORS ORIGIN:", CORS_ORIGIN);

app.use(cors({ credentials: true, origin: CORS_ORIGIN }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload({ createParentPath: true }));
app.use(session(config));

const PORT = 8080;
const IP = "0.0.0.0";

app.get("/", (req, res) => {
    res.json({ message: "Ok" });
});

app.get("/session", (req, res) => {
    res.send({
        name: req.session.name || "test",
        email: req.session.email || "test",
        userGroup: req.session.userGroup || "test"
    });
});

/* ============= Utils ============= */

/* ============= Utils ============= */




/* ============= Routes ============= */

/* ============= Routes ============= */




/* ============= Server ============= */

/* ============= Server ============= */


app.listen(PORT, IP);
console.log("Server running on http://%s:%s", IP, PORT);

module.exports = app;