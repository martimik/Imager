import express from 'express';
import Validator from 'express-validator';
import { Image, Favorite } from '../../database/index.js';
import { Logger, validate, authenticate } from "../../utils.js";

const { check } = Validator;

var router = express.Router();

/* GET user favorites */

router.get('/',
authenticate,
async(req, res, next) => {
    
    try{
        const favorites = await Favorite.findAll({      
            where: {
                userId: req.session.userId
            }
        });

        res.setHeader("Content-Type", "application/json");
        res.json({ favorites });

    } catch (error) {
        Logger.error(error);

        res.setHeader("Content-Type", "application/json");
        res.json({ error: error })
    }

});

/* POST add new image to user favorites */

router.post('/', 
[
    check("imageId")
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
                id: req.body.imageId,
            }
        })

        if(!image) {
            res.setHeader("Content-Type", "application/json");
            res.json({ error: 'Image does not exist.' });
        }
        
        const newFavorite = await Favorite.create({
            userId: req.session.userId,
            imageId: req.body.imageId,
        })

        Logger.info('Favorite ' + newFavorite.imageId  + ' inserted into database.')
        res.setHeader("Content-Type", "application/json");
        res.json({ success: 'Image ' + newFavorite.imageId + " added to favorites successfully."})

    } catch (error) {
    
        if(error.name == "SequelizeUniqueConstraintError"){
            Logger.error("Image already in user favorites.");

            res.setHeader("Content-Type", "application/json");
            res.json({ error: "Image already in favorites." });
        }

        Logger.error(error);

        res.setHeader("Content-Type", "application/json");
        res.json({ error: error });
    }
});

/* DELETE image from user favorites */

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
        const favorite = await Favorite.findOne({
            where: {
                userId: req.session.userId,
                imageId: req.params.id,    
            }
        })
        if(!favorite) {
            res.setHeader("Content-Type", "application/json");
            res.json({ error: 'Image not in favorites.' });
        }

        favorite.destroy();

        Logger.info('User ' + req.session.userId + ' removed Image ' + req.params.id + ' from favorites.')
        res.setHeader("Content-Type", "application/json");
        res.json({ success: 'Image removed from favorites successfully.'});

    } catch (error) {
        Logger.error(error);

        res.setHeader("Content-Type", "application/json");
        res.json({ error: error })
    }
});

export default router