import express from 'express';
import { Logger } from "../../utils.js";

var router = express.Router();

router.post('/', async(req, res, next) => {

    
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                Logger.error(err);
                next(err);
            } else {
                req.session = null;
                res.setHeader("Content-Type", "application/json");
                res.send({
                    name: null,
                    email: null,
                    userGroup: null
                });
            }
        });
    } else {
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify({ error: "Session does not exist." }));
    }
});

export default router