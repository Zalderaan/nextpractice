import { Schema, model, Document } from 'mongoose';

// 1. Define an interface representing a document in MongoDB
export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    createdAt: Date;
}

// 2. Create a new Schema according to the document interface
const userSchema = new Schema<IUser>(
    {
        // match each field to the interface
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
            trim: true,
        },

        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
        },

        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: 8,
            select: false // "By default, don't include this in query returns "
        }, 
        
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user'
        }
    },
    {
        timestamps: true // for automatically creating createdAt and updatedAt fields
    }
)

// 3. create an export the Model
const User = model<IUser>('User', userSchema);
export default User;