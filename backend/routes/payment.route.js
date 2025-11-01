import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {
  checkoutSuccess,
  createCheckoutSession,
} from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/create-checkeout-session', protectRoute, createCheckoutSession);
router.post('/checkeout-success', protectRoute, checkoutSuccess);
// router.get('/', protectRoute, getCoupon);
// router.get('/validate', protectRoute, validateCoupon);

export default router;
