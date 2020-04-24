import express from 'express';
import Validator from 'express-validator';
import Auth from "basic-auth";
import Bcrypt from 'bcrypt';
import Sequelize from 'sequelize';
import { User, Image, Favorite } from '../database/index.js';
import { Logger, validate, authenticate } from "../utils.js";

const { check, validationResult } = Validator;

var router = express.Router();

/* ============= /users ============= */

router.post('/',
[
    check("username")
        .isLength({ min: 1 })
        .isString()
        .escape(),
    check("email")
        .isLength({ min: 1 })
        .isString()
        .isEmail()
        .escape(),
    check("password")
        .isLength({ min: 1 })
        .isString()
        .escape(),
    check("userGroup")
        .isLength({ min: 1, max: 1 })
        .isInt()
        .escape()
],
validate,
async(req, res, next) => {

    try {
        
        const emailCheck = await User.count({
            where: {
                email: req.body.email,
            }
        })

        if(emailCheck > 0) {
            res.setHeader("Content-Type", "application/json");
            res.json({ error: 'Email already in use.' })
        }
        else {

            const newUser = await User.create({
                username: req.body.username,
                password: Bcrypt.hashSync(req.body.password, 10),
                email: req.body.email,
                userGroup: req.body.userGroup
            })

            Logger.info('User registered: ' + newUser.id, newUser)

            res.setHeader("Content-Type", "application/json");
            res.json({ success: 'User ' +  newUser.username + " was successfully registered."})
        }
        
    } catch (error) {

        Logger.error(error);

        res.setHeader("Content-Type", "application/json");
        res.json({ error: error })
    }
});

/* ============= /users/login ============= */

router.post('/login', async(req, res, next) => {

    const credentials = Auth(req);
    
    try {
        const userWithPassword = await User.findOne({
            where: {
                email: credentials.name,
            }
        })

        if(!userWithPassword){
            res.setHeader("Content-Type", "application/json");
            res.json({ error: 'User does not exist.' })
        }
        else {

            const validPassword = Bcrypt.compareSync(credentials.pass, userWithPassword.password)

            if (!validPassword) {
                res.setHeader("Content-Type", "application/json");
                res.json({ error: 'Invalid password.' })
            }
            else {
                const userWithoutPassword = await User.scope('withoutPassword').findByPk(userWithPassword.id)

                req.session.userId = userWithoutPassword.id;
                req.session.name = userWithoutPassword.username;
                req.session.email = userWithoutPassword.email;
                req.session.userGroup = userWithoutPassword.userGroup;

                res.setHeader("Content-Type", "application/json");
                res.json({
                    userId: userWithoutPassword.id,
                    name: req.session.name,
                    email: req.session.email,
                    userGroup: req.session.userGroup
                });
            }
        }     
    } catch (error) {

        Logger.error(error);

        res.setHeader("Content-Type", "application/json");
        res.json({
            error: "Catch error",
        });
    }
});

/* ============= /users/logout ============= */

router.post('/logout', function(req, res, next) {

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

/* ============= /users/favorites ============= */

/* GET user favorites */

router.get('/favorites',
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

router.post('/favorites', 
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

/* ============= /users/favorites/{id} ============= */

router.delete('/favorites/:id', 
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

/* ============= /users/private ============= */

/* GET private images */

router.get('/private', 
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