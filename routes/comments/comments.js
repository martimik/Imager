import express from 'express';
import Validator from 'express-validator';
import { Comment } from '../../database/index.js';
import { Logger, validate, authenticate } from "../../utils.js";

const { check } = Validator;

var router = express.Router();

/* ======================================= /comments/{id} ======================================= */

/* PUT edit comment by id */

router.put('/:id',
[
    check("id")
        .isLength({ min: 1 })
        .isString()
        .escape(),
    check("content")
        .isLength({ min: 1 })
        .isString()
        .escape(),
],
validate,
authenticate,
async(req, res, next) => {
    
    try {
        const comment = await Comment.findOne({
            where: {
                id: req.params.id,
            }
        })

        if(!comment) {
            res.setHeader("Content-Type", "application/json");
            res.json({ error: 'Comment does not exist.' });
        }
        else if(comment.userId != req.session.userId) {
            res.setHeader("Content-Type", "application/json");
            res.json({ error: 'Unauthorized.' });
        }
        else {
            comment.update({ content: req.body.content })

            Logger.info('Comment ' + comment.id + ' updated successfully.')
            res.setHeader("Content-Type", "application/json");
            res.json({ success: 'Comment ' + comment.id + ' updated successfully.'});
        }
            
    } catch(error) {
        Logger.error(error);

        res.setHeader("Content-Type", "application/json");
        res.json({ error: error })
    }
});

/* DELETE Comment by id */

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
        const comment = await Comment.findOne({
            where: {
                id: req.params.id,
            }
        })

        if(!comment) {
            res.setHeader("Content-Type", "application/json");
            res.json({ error: 'Comment does not exist.' });
        }
        else if(comment.userId != req.session.userId) {
            res.setHeader("Content-Type", "application/json");
            res.json({ error: 'Unauthorized.' });
        }

        comment.destroy();

        Logger.info('Comment ' + comment.id + ' removed from database.')
        res.setHeader("Content-Type", "application/json");
        res.json({ success: 'Comment deleted successfully.'});


    } catch(error) {
        Logger.error(error);

        res.setHeader("Content-Type", "application/json");
        res.json({ error: error })
    }
});


export default router