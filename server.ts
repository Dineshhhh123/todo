import * as express from "express";
import * as bodyParser from 'body-parser';
import * as cron from 'node-cron';
import * as nodemailer from 'nodemailer';
import Todo from "./src/models/Todo";
import User, { IUser } from '../TodoExample/src/models/User';
import mongoose from 'mongoose';
import authroutes from '../TodoExample/src/routes/authRoutes';
import todoroutes from '../TodoExample/src/routes/todoRoutes'

const app =  express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', authroutes);
app.use('/', todoroutes);

mongoose.connect('mongodb+srv://dk:dk123@cluster0.hg9p0.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch((err) => {
    console.log('Error:', err);
  });
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

cron.schedule('* * * * *', async () => {
  try {
    const todosDueForNotification = await Todo.find({
      expiry: { $lte: new Date() }, 
      completionStatus: false, 
    }).populate('userId');

    for (const todo of todosDueForNotification) {
      const user:IUser = await User.findById(todo.userId);
      if (user.email) {
        const transporter = nodemailer.createTransport({
          service : 'gmail',
          auth : {
            user: 'dineshkumar170800@gmail.com',
            pass: 'vvrqpblpatdbhjfe'
        }
        });

        const mailOptions = {
          from: 'dineshkumar170800@gmail.com',
          to: user.email,
          subject: 'Todo Item Due',
          text: `Your todo item "${todo.taskName}" is due now. Please complete it.`,
        };

        await transporter.sendMail(mailOptions);
      }

    }
  } catch (error) {
    console.error('Error sending notifications:', error);
  }
});

