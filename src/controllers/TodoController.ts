import { Request, Response } from 'express';
import Todo, { ITodo } from '../models/Todo';
import { authenticate } from '../middleware/authMiddleware';

class TodoController {
  async createTodo(req: Request, res: Response) {
    try {
      const { userId } = req.user;
      const { taskName, expiry } = req.body;

      const todo: ITodo = new Todo({
        userId,
        taskName,
        expiry,
      });

      await todo.save();
      res.status(201).json({ message: 'Todo created successfully', todo });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateTodo(req: Request, res: Response) {
    try {
      const { todoId } = req.body;
      const { taskName, expiry } = req.body;

      const todo: ITodo | null = await Todo.findByIdAndUpdate(
        todoId,
        { taskName, expiry },
        { new: true }
      );

      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }

      res.json({ message: 'Todo updated successfully', todo });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async deleteTodo(req: Request, res: Response) {
    try {
      const { todoId } = req.body;

      const todo: ITodo | null = await Todo.findByIdAndUpdate(
        todoId,
        { deletionTimestamp : true},
        { new: true }
      );
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }

      res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getTodo(req: Request, res: Response) {
    try {
      const { todoId } = req.body;

      const todo: ITodo | null = await Todo.findById(todoId);

      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }

      res.json({ message: 'Todo retrieved successfully', todo });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getTrash(req: Request, res: Response) {
    try {
  
      const todo = await Todo.find({ deletionTimestamp:true });
  
      res.send(todo);
    } catch (err) {
      res.status(500).send({
        message: err.message || 'Some error occurred while retrieving todo details.',
      });
    }
  }

  async restoreTodo(req: Request, res: Response) {
    try {
      const { todoId } = req.body;

      const todo: ITodo | null = await Todo.findByIdAndUpdate(
        todoId,
        { deletionTimestamp: false },
        { new: true }
      );

      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }

      res.json({ message: 'Todo restored successfully', todo });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getExpired(req: Request, res: Response) {
    try {
      const { userId } = req.user;

      const expired: ITodo[] = await Todo.find({
        userId,
        expiry: { $lt: new Date() },
      });

      res.json({ message: 'Expired todos retrieved successfully', expired });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default TodoController;
