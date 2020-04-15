import express from 'express';
import Auth from "basic-auth";
import Bcrypt from 'bcrypt';
import validator from "express-validator";
import { User } from '../database/index.js';
import { Logger } from "../utils.js";

var router = express.Router();

/* ============= /users ============= */

router.post('/', async(req, res, next) => {

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

            Logger.info('User registered: ' + newUser.username, newUser)

            res.setHeader("Content-Type", "application/json");
            res.json({ success: 'User ' +  newUser.username + " registered."})
        }
        
    } catch (error) {

        Logger.error(error);

        res.setHeader("Content-Type", "application/json");
        res.json({ error: 'Catch error.' })
    }
});

/* ============= /users/login ============= */

router.post('/login', async(req, res, next) => {

    const credentials = Auth(req);
    
    try {
        const userWithPassword = await User.findOne({
            where: {
                username: credentials.name,
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

                req.session.name = userWithoutPassword.username;
                req.session.email = userWithoutPassword.email;
                req.session.userGroup = userWithoutPassword.userGroup;

                res.setHeader("Content-Type", "application/json");
                res.json({
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

router.get('/favorites', function(req, res, next) {
    res.end('favorites ok');
});

router.post('/favorites', function(req, res, next) {
    res.end('favorites ok');
});

/* ============= /users/favorites/{id} ============= */

router.delete('/favorites', function(req, res, next) {
    res.end('favorites ok');
});
  
export default router