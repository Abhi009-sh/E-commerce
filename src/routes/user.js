import {Router} from 'express';
const router=Router();
import {
    userRegister,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword
} from '../controllers/user.js';
import {auth} from '../middlewares/auth.js';

router.post('/register',userRegister);
router.get('/login',loginUser);
router.post('/logout', auth, logoutUser);
router.post('/change-password', auth, changeCurrentPassword);
router.post('/refresh-token',refreshAccessToken);



export default router;