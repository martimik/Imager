import express from 'express';
import { Image } from '../../database/index.js';
import { Logger, authenticate } from "../../utils.js";

var router = express.Router();

/* GET private images */

router.get('/', 
authenticate,
async(req, res, next) => {
    
    try{
        const images = await Image.findAll({
            where: {
                isprivate: true,
                userId: req.session.userId
            }
        });

        res.setHeader("Content-Type", "application/json");
        res.json({ images });

    } catch (error) {
        Logger.error(error);

        res.setHeader("Content-Type", "application/json");
        res.json({ error: error })
    }

});

export default router