import { Router } from 'express';
import { changeUserPassword } from '../controllers/controllerUsers';

const router = Router();

router.route("/")
    .patch(changeUserPassword)

export default router;