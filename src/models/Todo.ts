import mongoose, { Schema, Document } from 'mongoose';

export interface ITodo extends Document {
  userId: string;
  taskName: string;
  creationTimestamp: Date;
  editTimestamp: Date;
  deletionTimestamp: boolean;
  expiry: Date;
  completionStatus: boolean;
}

const TodoSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taskName: { type: String, required: true },
  creationTimestamp: { type: Date, default: Date.now },
  editTimestamp: { type: Date, default: Date.now },
  deletionTimestamp:{type:Boolean,default:false},
  expiry: { type: Date },
  completionStatus: { type: Boolean, default: false },

});

export default mongoose.model<ITodo>('Todo', TodoSchema);
