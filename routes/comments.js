import express from 'express';
import validator from "express-validator";

var router = express.Router();

/* ============= /comments/{id} ============= */

router.put('/:id', function(req, res, next) {
    res.end('/images/{id} put ok');
});

router.delete('/:id', function(req, res, next) {
    res.end('/images/{id} delete ok');
});


export default router