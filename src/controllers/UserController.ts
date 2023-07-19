import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import * as nodemailer from 'nodemailer';
import { authenticate } from '../middleware/authMiddleware';

const secretKey = 'your-secret-key';

class UserController {

  async signup(req: Request, res: Response) {
    

  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    console.log(password);

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword)

    const user: IUser = new User({
      email,
      password: hashedPassword,
      name,
    });
    console.log(user)

    await user.save();

    res.status(201).json({ message: 'User created successfully'});
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}

  async updatePassword(req: Request, res: Response) {
    try {
        const { userId } = req.body;
        const { currentPassword, newPassword } = req.body;
        console.log(userId)
        const user = await User.findById(userId);
  
        
  
        const isPasswordValid = await bcrypt.compare(
          currentPassword,
          user.password
        );
  
        if (!isPasswordValid) {
          return res.status(401).json({ message: 'Invalid current password' });
        }
  
        const hashedPassword = await bcrypt.hash(newPassword, 10);
  
        user.password = hashedPassword;
        await user.save();
  
        res.json({ message: 'Password updated successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
      }
  }

  async forgotPassword (req: Request, res: Response) {
    try {
      const { email } = req.body;
  
      const user = await User.findOne({ email });
      console.log(user)
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const resetToken = jwt.sign({ userId: user._id }, secretKey);
  
      user.resetToken = resetToken;
      await user.save();
  
      const resetLink = `localhost:3000/reset-password?token=${resetToken}`;
      console.log(resetLink)
  
      let config = {
        service : 'gmail',
        auth : {
            user: 'dineshkumar170800@gmail.com',
            pass: 'vvrqpblpatdbhjfe'
        }
    }
    
    let transporter = nodemailer.createTransport(config);

    


    let message = {
        from : 'dineshkumar170800@gmail.com',
        to : user.email,
        subject: "Place Order",
        text: `Please click the following link to reset your password: ${resetLink}`,
    }

    transporter.sendMail(message).then(() => {
        return res.status(201).json({
            msg: "you should receive an email"
        })
    }).catch(error => {
        return res.status(500).json({ error })
    })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  resetPassword = async (req: Request, res: Response) => {
    try {
      const { token } = req.headers;
      const { newPassword } = req.body;
  
      console.log(token)
      const decodedToken = jwt.verify(token, secretKey) as { userId: string };
      console.log(decodedToken)
      const user = await User.findById(decodedToken.userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetToken = undefined; // Remove the reset token
      await user.save();
  
      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  async updateUser(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      const { name } = req.body;
      console.log(userId);

      const user = await User.findByIdAndUpdate(
        userId,
        { name },
        { new: true }
      );
      console.log(user)

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ message: 'User updated successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default UserController;
