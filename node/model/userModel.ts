import mongoose, { Schema, Document } from "mongoose";

// تعریف اینترفیس برای تایپ‌دهی
export interface IUser extends Document {
    user_phone: string;
    first_name:string,
    password:string,
    last_name:string,
    image_profile:string,
    uuid:string;

}

const userSchema: Schema = new Schema(
    {
        user_phone: { type: String, required: true,unique:true },
        uuid:{type:String,required:true},
        first_name:{type:String,required:true},
        last_name:{type:String,required:true},
        image_profile:{type:String,required:false},
        
    },
    { timestamps: true }
);

export const UserModel =  mongoose.model<IUser>("User", userSchema);
