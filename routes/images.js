import express from 'express';
import Validator from 'express-validator';
import Sequelize from 'sequelize';
import { Image } from '../database/index.js';
import { Logger, MinioClient, validate, authenticate } from "../utils.js";

const { check, validationResult } = Validator;

var router = express.Router();

/* ============= /images ============= */

/* POST new image */

router.post('/', 
[
    check("title")
        .isLength({ min: 1 })
        .isString()
        .escape(),
    check("isprivate")
        .isBoolean()
        .escape(),
],
validate,
authenticate,
async(req, res, next) => {

    try {

        if (!req.files || Object.keys(req.files).length === 0) {
            res.setHeader("Content-Type", "application/json");
            res.json({ error: "Missing image file." })
        }

        const newImage = Image.build({
            userId: req.session.userId,
            title: req.body.title,
            isprivate: req.body.isprivate,
        })

        const file = req.files.image.tempFilePath;
        
        await MinioClient.fPutObject('images', newImage.id, file, function(err, etag) {
            if (err) return console.log(err)
            Logger.info('Image ' + newImage.id + ' uploaded to block storage.');
        });

        await newImage.save();

        Logger.info('Image ' + newImage.id, newImage + ' inserted into database.')
        res.setHeader("Content-Type", "application/json");
        res.json({ success: 'Image ' +  newImage.title + " uploaded successfully."})

    } catch (error) {
        Logger.error(error);

        res.setHeader("Content-Type", "application/json");
        res.json({ error: error })
    }
});

/* GET all images, exclude private images */

router.get('/', 
authenticate,
async(req, res, next) => {
    
    try{
        const images = await Image.findAll({      
        where: {
            isprivate: false
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

/* ============= /images/{id} ============= */

/* GET specific image file with id */

router.get('/:id',
[
    check("id")
        .isLength({ min: 1 })
        .isString()
        .escape(),
],
validate,
authenticate,
async(req, res, next) => {
    
    try {
        const image = await Image.findOne({
            where: {
                id: req.params.id,
            }
        })

        if(!image) {
            res.setHeader("Content-Type", "application/json");
            res.json({ error: 'Image does not exist.' });
        }
        else if(image.isprivate && image.userId != req.session.userId) {
            res.setHeader("Content-Type", "application/json");
            res.json({ error: 'Unauthorized.' });
        }
        else {
            MinioClient.getObject("images", image.id, function (error, file) {
                if (error) {
                    Logger.error(err);
                    return res.status(500).send(error);
                }
                file.pipe(res);
            });
        }

    } catch(error) {
        Logger.error(error);

        res.setHeader("Content-Type", "application/json");
        res.json({ error: error })
    }
});

/* DELETE specific image file with id */

router.delete('/:id',
[
    check("id")
        .isLength({ min: 1 })
        .isString()
        .escape(),
],
validate,
authenticate,
async(req, res, next) => {
    
    try {
        const image = await Image.findOne({
            where: {
                id: req.params.id,
            }
        })

        if(!image) {
            res.setHeader("Content-Type", "application/json");
            res.json({ error: 'Image does not exist.' });
        }
        else if(image.userId != req.session.userId) {
            res.setHeader("Content-Type", "application/json");
            res.json({ error: 'Unauthorized.' });
        }

        MinioClient.removeObject("images", image.id, function (error, file) {
            if (error) {
                Logger.error(err);
                return res.status(500).send(error);

            }
            Logger.info('Image ' + image.id + ' removed from block storage.');
            image.destroy();

            Logger.info('Image ' + image.id, image + ' removed from database.')
            res.setHeader("Content-Type", "application/json");
            res.json({ success: 'Image deleted successfully.'});

        });

    } catch(error) {
        Logger.error(error);

        res.setHeader("Content-Type", "application/json");
        res.json({ error: error })
    }
});

/* ============= /images/{id}/comments ============= */

router.post('/:id/comments', function(req, res, next) {
    res.end('/{id}/comments post ok');
});

/* ============= /images/{id}/votes ============= */

router.post('/:id/votes', function(req, res, next) {
    res.end('/{id}/votes post ok');
});


export default router