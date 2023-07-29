import { Router } from 'express';
import { loginController, registerController, verifyEmail } from '../controllers/authControllers';

const router = Router();

router.route("/login")
    .post(loginController)

router.route("/register")
    .post(registerController)

router.route("/verify")
    .post(verifyEmail)

export default router;