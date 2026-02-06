import  {Router} from 'express';
import{ upload} from '../middlewares/multer.js';
const router=Router();
import{
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProductByAdmin,
    deleteProductByAdmin
} from '../controllers/product.js';
import {auth} from '../middlewares/auth.js';


router.post('/create-product', auth,upload.single("imageUrl"), createProduct);
router.get('/all-products',getAllProducts);
router.get('/single-product/:productId',getSingleProduct);
router.put('/update-product/:productId',updateProductByAdmin);
router.delete('/delete-product/:productId',deleteProductByAdmin);
export default router;
