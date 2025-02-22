import { randomUUID } from "crypto";
import mongoose, { Document, Schema } from "mongoose";

export interface ChatMessage extends Document {
    userId: string; // شناسه کاربر ارسال کننده پیام
    type: "text" | "image" | "video" | "document" | "file" | "code"; // نوع پیام
    language?: string | '';
    content: string; // محتوای پیام (متن یا لینک فایل)
    sender:string;
    received:boolean;
    read_reciept:boolean;
    receiver:string;
    fileUrl?: string; // لینک فایل در صورت ارسال فایل
    timestamp: Date; // زمان ارسال پیام
}

// تعریف شِما برای پیام‌های چت
const chatSchema: Schema = new Schema(
    {
        type: { type: String, enum: ["text", "code", "image", "video", "document","file"], required: true }, // اضافه کردن نوع document
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // ارجاع به مدل User
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // ارجاع به مدل User
        content: { type: String, required: true },
        fileUrl: { type: String }, // اضافه کردن لینک فایل
    },
    { timestamps: true }
);



export interface ChatRoom extends Document {
    room_id: string;
    user1: string;
    user2: string;
    open: boolean;
    messages: ChatMessage[];
}


const PrivateChatRoomSchema: Schema = new Schema({
    room_id: { type: String, required: true,unique:true },
    open: { type: Boolean, required: true },
    debuger: {  type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // ارجاع به مدل User
    applicator: {  type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // ارجاع به مدل User
    messages: [chatSchema],
})


export const ChatRoomModel = mongoose.model<ChatRoom>("ChatRoom", PrivateChatRoomSchema);
export const ChatMessageModel = mongoose.model<ChatMessage>("ChatMessage", chatSchema);