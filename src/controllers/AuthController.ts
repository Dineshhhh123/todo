import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

const secretKey = 'your-secret-key';

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      console.log(email)

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      console.log(user)

      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(isPasswordValid)

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ userId: user._id }, secretKey);
      console.log(token)

      res.json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default AuthController;
