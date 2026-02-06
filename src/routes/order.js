import {Router} from 'express'
const router=Router();

import{
    createOrder,
    getOrderById,
    getAllOrdersForAdmin,
    markOrderAsPaid,
    markOrderAsDelivered,
} from '../controllers/order.js';
import {auth} from '../middlewares/auth.js';

router.post('/create',auth,createOrder);
router.get('/all-orders',auth,getAllOrdersForAdmin);
router.get('/:orderId',auth,getOrderById);
router.put('/mark-as-paid/:orderId',auth,markOrderAsPaid);
router.put('/mark-as-delivered/:orderId',auth,markOrderAsDelivered);
export default router;