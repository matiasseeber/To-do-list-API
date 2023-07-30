import { Router } from 'express';
import { createTodo, getAllTodos } from '../controllers/controllerTodos';

const router = Router();

router.route("/")
    .get(getAllTodos)
    .post(createTodo)

export default router;