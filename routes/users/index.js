import express from 'express';
import Users from './users.js'
import Login from './login.js';
import Logout from './logout.js';
import Favorites from './favorites.js';
import Private from './private.js'

var router = express.Router();

router.use('/', Users);
router.use('/login', Login);
router.use('/logout', Logout);
router.use('/favorites', Favorites);
router.use('/private', Private);

  
export default router