import express from 'express';

var router = express.Router();

/* ============= /comments/{id} ============= */

router.put('/:id', function(req, res, next) {
    res.end('/images/{id} put ok');
});

router.delete('/:id', function(req, res, next) {
    res.end('/images/{id} delete ok');
});


export default router