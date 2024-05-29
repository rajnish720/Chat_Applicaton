import express from 'express'
import middleware from '../middleware/middleware.js';
import { getUserForSidebar } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', middleware, getUserForSidebar);

export default router;