import mongoose from "mongoose";

export interface IUser {
    name: string;
    role?: 'admin' | 'user';
    password: string;
    email:string;
    date?:Date
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required:true,
    },
    role:{
        type:String,
        default:"user"
    },
    date:{
        type:Date,
        default:new Date()
    }
});


export const User = mongoose.models.User || mongoose.model('User', userSchema);