import express from 'express';
import validator from "express-validator";
import { User } from '../database/index.js';

var router = express.Router();

/* ============= /images ============= */

router.post('/', function(req, res, next) {
    res.end('/images post ok');
});

router.get('/', function(req, res, next) {
    res.end('/images get ok');
});

/* ============= /images/{id} ============= */

router.get('/:id', function(req, res, next) {
    res.end('/images/{id} get ok');
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