import express from 'express';
import Auth from "basic-auth";
import Bcrypt from 'bcrypt';
import { User } from '../../database/index.js';
import { Logger } from "../../utils.js";

var router = express.Router();

router.post('/', async(req, res, next) => {

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

                Logger.info('User: ' + req.session.userId + ' logged in.');

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

export default router