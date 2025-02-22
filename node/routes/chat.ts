import { Router, Request, Response } from 'express';
import upload from '../middleware/middleware';
import {ChatMessageModel} from '../model/chatModel';
import { createChatRoom, getMessages, getChatRoomById, getDebuggerChatList } from "../controllers/chatController";
import { getChatRoomId } from '../services/chatServices';
// import { uploadFile } from "../controllers/chatController";
const router: Router = Router();

router.post("/", async (req: Request, res: Response): Promise<void> =>{
    try {
        const { userId, type, content } = req.body;
        

        // اعتبارسنجی ورودی
        if (!userId || !type || !content) {
            res.status(400).json({ error: "userId, type, and content are required" });
            return;
        }

        if (!["text", "image", "video"].includes(type)) {
            res.status(400).json({ error: "Invalid type. Must be 'text', 'image', or 'video'." });
            return;
        }

        // ایجاد پیام جدید
        const chatMessage = new ChatMessageModel({
            userId,
            type,
            content,
        });

        // ذخیره پیام در دیتابیس
        await chatMessage.save();

        res.status(201).json({ message: "Chat message saved successfully", chatMessage });
    } catch (error) {
        console.error("Error saving chat message:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// دریافت تمام پیام‌ها
router.get("/", async (req, res) => {
    try {
        const messages = await ChatMessageModel.find().sort({ createdAt: -1 }); // پیام‌ها به ترتیب زمانی معکوس
        res.status(200).json({ messages });
    } catch (error) {
        console.error("Error retrieving messages:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get("/:id", async (req:Request, res:Response): Promise<void> => {
    try {
        const { id } = req.params;

        // بررسی اگر ID ارسال نشده باشد
        if (!id) {
            res.status(400).json({ error: "Chat ID is required" });
            return;
        }

        // یافتن پیام بر اساس ID با استفاده از findById
        const chatMessage = await ChatMessageModel.findById(id);

        // اگر پیام پیدا نشد
        if (!chatMessage) {
            res.status(404).json({ error: "Chat message not found" });
            return;
        }

        // بازگشت پیام
        res.status(200).json({ chatMessage });
    } catch (error) {
        console.error("Error fetching chat message:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.post(
    "/upload",
    upload.single("file"),
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { userId } = req.body;

            if (!userId || !req.file) {
                res.status(400).json({ error: "userId and file are required" });
                return;
            }

            // تعیین نوع فایل
            let fileType: "image" | "video" | "document";
            if (req.file.mimetype.startsWith("image")) {
                fileType = "image";
            } else if (req.file.mimetype.startsWith("video")) {
                fileType = "video";
            } else {
                fileType = "document";
            }

            console.log(fileType)
            console.log(req.file)

            // ذخیره پیام در دیتابیس
            // const chatMessage = new ChatMessageModel({
            //     userId,
            //     type: fileType,
            //     content: req.file.path, // مسیر فایل
            // });

            // await chatMessage.save();

            res.status(201).json({ message: "File uploaded and message saved" });
        } catch (error) {
            console.error("Error uploading file:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);




// مسیر برای ایجاد چت روم جدید
router.post("/create", createChatRoom);
router.post("/room", getChatRoomById);
// مسیر برای ارسال پیام
// router.post("/send",upload.single('file'),sendMessage);

// مسیر برای دریافت پیام‌ها در یک چت روم
router.get("/:room_id/messages", getMessages);

router.post('/room_list/',getDebuggerChatList)


export default router;
