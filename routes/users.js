import express from 'express';
import Auth from "basic-auth";
import Bcrypt from 'bcrypt';
import validator from "express-validator";
import { User } from '../database/index.js';

var router = express.Router();

/* ============= /users ============= */

router.post('/', function(req, res, next) {
    res.end('users ok');
});

/* ============= /users/login ============= */

router.post('/login', function(req, res, next) {

    res.end("login ok");

    const credentials = Auth(req);
    
    try {
        const userWithPassword = User.findOne({
            where: {
                username: credentials.username,
            },
            rejectOnEmpty: true,
        })

        const validPassword = Bcrypt.compare(credentials.password, userWithPassword.password)

        if (!validPassword) {
            return h
                .response({
                    success: 'FALSE',
                })
                .code(403)
        }

        const userWithoutPassword = User.scope('withoutPassword')
            .findByPk(userWithPassword.id)

        req.session.name = userWithoutPassword.name;
        req.session.email = userWithoutPassword.email;
        req.session.userGroup = userWithoutPassword.userGroup;

        res.send({
            name: req.session.name,
            email: req.session.email,
            userGroup: req.session.userGroup
        });
        
    } catch (error) {

        Logger.error(error);

        res.send({
            success: "False",
        });
    }
});

/* ============= /users/logout ============= */

router.post('/logout', function(req, res, next) {
    res.end('logout ok');
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