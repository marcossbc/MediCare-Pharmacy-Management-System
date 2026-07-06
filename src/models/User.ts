import { Schema, models, model } from 'mongoose';

export type UserRole = 'admin' | 'employee';

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
    active: { type: Boolean, default: true },
  
  },
  { timestamps: true }
);

export default models.User || model<IUser>('User', UserSchema);
