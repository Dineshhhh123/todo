import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  resetToken:string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  resetToken:{ type:String},
});

export default mongoose.model<IUser>('User', UserSchema);
