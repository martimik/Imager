import express from 'express';
import Comments from './comments.js';

var router = express.Router();

router.use('/', Comments);
  
export default router  