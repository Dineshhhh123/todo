import * as express from 'express';
const router = express.Router();
import TodoController from '../controllers/TodoController';
const todoController = new TodoController();
import { authenticate } from '../middleware/authMiddleware';


router.post('/todo', authenticate, todoController.createTodo);
router.put('/todo/update', authenticate, todoController.updateTodo);
router.post('/todo/delete',authenticate, todoController.deleteTodo);
router.get('/todo/get', authenticate, todoController.getTodo);
router.get('/trash', authenticate, todoController.getTrash);
router.post('/trash/restore', authenticate, todoController.restoreTodo);
router.get('/expired', authenticate, todoController.getExpired);

export default router;