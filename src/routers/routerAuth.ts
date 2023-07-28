import { Router } from 'express';
import { changeUserPassword, verifyEmail } from '../controllers/controllerAuth';

const router = Router();

router.route("/verify")
    .post(verifyEmail)

router.route("/password")
    .post(changeUserPassword)

export default router;