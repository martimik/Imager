import express from 'express';
import Reports from './reports.js';

var router = express.Router();

router.use('/', Reports);
  
export default router  