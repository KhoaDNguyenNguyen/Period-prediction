import express from 'express';
import {registerUser, loginUser} from '../controllers/authController.js';
import {authenticate} from '../middleware/authenticate.js';
import {saveSurvey} from '../controllers/surveyController.js';
// import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({status: 'ok'});
});

// User registration endpoint
router.post('/register', registerUser);

// User login endpoint
router.post('/login', loginUser);
router.post('/survey', authenticate, saveSurvey);
// Protected route example
router.get('/protected', authenticate, (req, res) => {
  res.json({message: 'This is a protected route', user: req.user});
});

export default router;
