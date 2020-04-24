import express from 'express';
import Validator from 'express-validator';
import Fs from 'fs';
import { Image, Comment, Report } from '../database/index.js';
import { Logger, MinioClient, validate, authenticate } from "../utils.js";

const { check, validationResult } = Validator;

var router = express.Router();

/* ======================================= /reports ======================================= */

/* GET all reports */

router.get('/',
authenticate,
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