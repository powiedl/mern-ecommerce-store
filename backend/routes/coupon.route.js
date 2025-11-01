import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getCoupon, validateCoupon } from '../controllers/coupon.controller.js';

const router = express.Router();

router.get('/', protectRoute, getCoupon);
router.get('/validate', protectRoute, validateCoupon);
// router.get('/', protectRoute, getCartProducts);
// router.post('/', protectRoute, addToCart);
// router.delete('/', protectRoute, removeAllFromCart);
// router.put('/:id', protectRoute, updateQuantity);

export default router;
