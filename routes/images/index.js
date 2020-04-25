import express from 'express';
import Images from './images.js';

var router = express.Router();

router.use('/', Images);

export default router