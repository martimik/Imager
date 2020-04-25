import express from 'express';
import { Report } from '../../database/index.js';
import { Logger, authenticateAdmin } from "../../utils.js";

var router = express.Router();

/* GET all reports in database */

router.get('/',
authenticateAdmin,
async(req, res, next) => {
    
    try{
        const reports = await Report.findAll({});

        res.setHeader("Content-Type", "application/json");
        res.json({ reports });

    } catch (error) {
        Logger.error(error);

        res.setHeader("Content-Type", "application/json");
        res.json({ error: error })
    }

});

export default router