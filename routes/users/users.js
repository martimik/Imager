import express from 'express';
import Validator from 'express-validator';
import Bcrypt from 'bcrypt';
import { User } from '../../database/index.js';
import { Logger, validate } from "../../utils.js";

const { check } = Validator;

var router = express.Router();

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
  
export default router